import fs from 'fs/promises';
import path from 'path';
import { removeLeadingSlash } from 'react-cosmos-core';
import { detectCosmosConfig } from '../cosmosConfig/detectCosmosConfig';
import { CosmosConfig } from '../cosmosConfig/types';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs';
import {
  CosmosPluginConfig,
  ExportPlugin,
  PartialCosmosPluginConfig,
  UiCosmosPluginConfig,
} from '../cosmosPlugin/types';
import { logPluginInfo } from '../shared/logPluginInfo';
import { getExportPlaygroundHtml } from '../shared/playgroundHtml';
import { requirePluginModule } from '../shared/requirePluginModule';
import { getStaticPath } from '../shared/staticServer';

const corePlugins: ExportPlugin[] = [];

export async function generateExport() {
  const cosmosConfig = detectCosmosConfig();

  const pluginConfigs = getPluginConfigs(cosmosConfig);
  logPluginInfo(pluginConfigs);

  // Clear previous export (or other files at export path)
  const { exportPath } = cosmosConfig;
  await fs.rm(exportPath, { recursive: true, force: true });

  // Copy static assets first, so that the built index.html overrides the its
  // template file (in case the static assets are served from the root path)
  await copyStaticAssets(cosmosConfig);

  const exportPlugins = getExportPlugins(cosmosConfig, pluginConfigs);

  for (const plugin of [...corePlugins, ...exportPlugins]) {
    try {
      await plugin({ cosmosConfig });
    } catch (err) {
      console.log(`[Cosmos][${plugin.name}] Export plugin failed`);
      throw err;
    }
  }

  await exportPlaygroundFiles(cosmosConfig, pluginConfigs);

  console.log('[Cosmos] Export complete!');
  console.log(`Export path: ${cosmosConfig.exportPath}`);
}

async function copyStaticAssets(cosmosConfig: CosmosConfig) {
  const { staticPath } = cosmosConfig;
  if (!staticPath) {
    return;
  }

  const { exportPath } = cosmosConfig;
  if (exportPath.indexOf(staticPath) !== -1) {
    console.warn(
      `[Cosmos] Warning: Can't export static path because it contains the export path! (avoiding infinite loop)`
    );
    console.warn('Public path:', staticPath);
    console.warn('Export path:', exportPath);
    return;
  }

  const staticStat = await fs.stat(staticPath);
  if (!staticStat.isDirectory()) {
    console.log(
      `[Cosmos] Warning: config.staticPath doesn't point to a valid dir`,
      staticPath
    );
    return;
  }

  const { publicUrl } = cosmosConfig;
  const exportStaticPath = path.resolve(
    exportPath,
    removeLeadingSlash(publicUrl)
  );
  fs.cp(staticPath, exportStaticPath, { recursive: true });
}

function getExportPlugins(
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  return pluginConfigs
    .filter(p => p.export)
    .map(p =>
      requirePluginModule<ExportPlugin>(cosmosConfig.rootDir, p, 'export')
    );
}

async function exportPlaygroundFiles(
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  const { exportPath } = cosmosConfig;

  // Copy UI plugins to export path and embed them in the playground HTML
  // with updated paths
  const uiPlugins = pluginConfigs.filter(isUiPlugin);
  const copiedUiPlugins = await Promise.all(
    uiPlugins.map(p => exportUiPlugin(cosmosConfig, p))
  );

  await fs.copyFile(
    require.resolve('../../playground/index.bundle'),
    path.resolve(exportPath, '_playground.js')
  );
  await fs.copyFile(
    getStaticPath('favicon.ico'),
    path.resolve(exportPath, '_cosmos.ico')
  );

  const playgroundHtml = getExportPlaygroundHtml(cosmosConfig, copiedUiPlugins);
  await fs.writeFile(path.resolve(exportPath, 'index.html'), playgroundHtml);
}

async function exportUiPlugin(
  cosmosConfig: CosmosConfig,
  pluginConfig: UiCosmosPluginConfig
): Promise<PartialCosmosPluginConfig> {
  const { rootDir, exportPath } = cosmosConfig;
  const pluginPath = path.join(exportPath, '_plugin');

  const pluginRootDir = path.resolve(rootDir, pluginConfig.rootDir);
  const srcUiPath = path.resolve(rootDir, pluginConfig.ui);

  const relUiPath = path.relative(pluginRootDir, srcUiPath);
  const pluginDirName = pluginRootDir.split('/').pop()!;
  const targetUiPath = path.resolve(pluginPath, pluginDirName, relUiPath);

  await fs.mkdir(path.dirname(targetUiPath), { recursive: true });
  await fs.copyFile(srcUiPath, targetUiPath);

  return {
    name: pluginConfig.name,
    ui: path.relative(pluginPath, targetUiPath),
  };
}

function isUiPlugin(
  pluginConfig: CosmosPluginConfig
): pluginConfig is UiCosmosPluginConfig {
  return Boolean(pluginConfig.ui);
}
