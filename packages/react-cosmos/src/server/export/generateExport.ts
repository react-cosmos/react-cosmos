import { copyFile, cp, rm, stat, writeFile } from 'fs/promises';
import path from 'path';
import { removeLeadingSlash } from 'react-cosmos-core';
import { detectCosmosConfig } from '../cosmosConfig/detectCosmosConfig';
import { CosmosConfig } from '../cosmosConfig/types';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs';
import { CosmosPluginConfig, ExportPlugin } from '../cosmosPlugin/types';
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
  await rm(exportPath, { recursive: true, force: true });

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

  const staticStat = await stat(staticPath);
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
  cp(staticPath, exportStaticPath, { recursive: true });
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

  for (const pluginConfig of pluginConfigs) {
    await exportPlugin(cosmosConfig, pluginConfig);
  }

  await copyFile(
    require.resolve('../../playground/index.bundle'),
    path.resolve(exportPath, '_playground.js')
  );
  await copyFile(
    getStaticPath('favicon.ico'),
    path.resolve(exportPath, '_cosmos.ico')
  );

  const playgroundHtml = getExportPlaygroundHtml(cosmosConfig, pluginConfigs);
  await writeFile(path.resolve(exportPath, 'index.html'), playgroundHtml);
}

async function exportPlugin(
  cosmosConfig: CosmosConfig,
  pluginConfig: CosmosPluginConfig
) {
  const { rootDir, exportPath } = cosmosConfig;
  const pluginExportDir = path.resolve(exportPath, '_plugin');

  // Copy plugin config
  const relConfigPath = path.join(pluginConfig.rootDir, 'cosmos.plugin.json');
  const absConfigPath = path.resolve(rootDir, relConfigPath);
  await copyFile(absConfigPath, path.resolve(pluginExportDir, relConfigPath));

  // Copy UI script
  if (pluginConfig.ui) {
    const absUiPath = path.resolve(rootDir, pluginConfig.ui);
    await copyFile(absUiPath, path.resolve(pluginExportDir, pluginConfig.ui));
  }
}
