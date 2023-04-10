import fs from 'fs/promises';
import path from 'path';
import {
  CosmosPluginConfig,
  removeLeadingSlash,
  UiCosmosPluginConfig,
} from 'react-cosmos-core';
import { coreServerPlugins } from '../corePlugins/index.js';
import { detectCosmosConfig } from '../cosmosConfig/detectCosmosConfig.js';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import { importServerPlugins } from '../shared/importServerPlugins.js';
import { logPluginInfo } from '../shared/logPluginInfo.js';
import { getExportPlaygroundHtml } from '../shared/playgroundHtml.js';
import { getStaticPath } from '../shared/staticPath.js';
import { resolve } from '../utils/resolve.js';

export async function generateExport() {
  const platformType = 'web';
  let cosmosConfig = await detectCosmosConfig();

  const pluginConfigs = await getPluginConfigs({
    cosmosConfig,
    // Relative paths work in exports because all plugin modules are copied
    // inside the export path
    relativePaths: true,
  });
  logPluginInfo(pluginConfigs);

  const userPlugins = await importServerPlugins(
    pluginConfigs,
    cosmosConfig.rootDir
  );
  const plugins = [...coreServerPlugins, ...userPlugins];

  for (const plugin of plugins) {
    if (plugin.config) {
      try {
        cosmosConfig = await plugin.config({ cosmosConfig, platformType });
      } catch (err) {
        console.log(`[Cosmos][plugin:${plugin.name}] Config hook failed`);
        throw err;
      }
    }
  }

  // Clear previous export (or other files at export path)
  const { exportPath } = cosmosConfig;
  await fs.rm(exportPath, { recursive: true, force: true });
  await fs.mkdir(exportPath, { recursive: true });

  // Copy static assets first, so that the built index.html overrides the its
  // template file (in case the static assets are served from the root path)
  await copyStaticAssets(cosmosConfig);

  for (const plugin of plugins) {
    if (!plugin.export) continue;

    try {
      await plugin.export({ cosmosConfig });
    } catch (err) {
      console.log(`[Cosmos][plugin:${plugin.name}] Export failed`);
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
    resolve('react-cosmos-ui/dist/playground.bundle.js'),
    path.resolve(exportPath, 'playground.bundle.js')
  );
  await fs.copyFile(
    resolve('react-cosmos-ui/dist/playground.bundle.js.map'),
    path.resolve(exportPath, 'playground.bundle.js.map')
  );
  await fs.copyFile(
    getStaticPath('favicon.ico'),
    path.resolve(exportPath, '_cosmos.ico')
  );

  const playgroundHtml = await getExportPlaygroundHtml(
    cosmosConfig,
    copiedUiPlugins
  );
  await fs.writeFile(path.resolve(exportPath, 'index.html'), playgroundHtml);
}

async function exportUiPlugin(
  cosmosConfig: CosmosConfig,
  pluginConfig: UiCosmosPluginConfig
): Promise<CosmosPluginConfig> {
  const { rootDir, exportPath } = cosmosConfig;
  const pluginPath = path.join(exportPath, '_plugin');

  const pluginRootDir = path.resolve(rootDir, pluginConfig.rootDir);
  const srcUiPath = path.resolve(rootDir, pluginConfig.ui);

  const relUiPath = path.relative(pluginRootDir, srcUiPath);
  const pluginDirName = pluginRootDir.split(path.sep).pop()!;
  const targetUiPath = path.resolve(pluginPath, pluginDirName, relUiPath);

  await fs.mkdir(path.dirname(targetUiPath), { recursive: true });
  await fs.copyFile(srcUiPath, targetUiPath);

  return {
    name: pluginConfig.name,
    rootDir: pluginDirName,
    ui: path.relative(pluginPath, targetUiPath),
  };
}

function isUiPlugin(
  pluginConfig: CosmosPluginConfig
): pluginConfig is UiCosmosPluginConfig {
  return Boolean(pluginConfig.ui);
}
