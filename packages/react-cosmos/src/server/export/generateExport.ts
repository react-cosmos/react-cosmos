import fs from 'fs-extra';
import path from 'path';
import { removeLeadingSlash } from 'react-cosmos-core/utils';
import { detectCosmosConfig } from '../cosmosConfig/detectCosmosConfig.js';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import { CosmosPluginConfig, ExportPlugin } from '../cosmosPlugin/types.js';
import { getExportPlaygroundHtml } from '../shared/playgroundHtml.js';
import { getStaticPath } from '../shared/staticServer.js';

const corePlugins: ExportPlugin[] = [];

export async function generateExport() {
  const cosmosConfig = detectCosmosConfig();

  // Clear previous export (or other files at export path)
  const { exportPath } = cosmosConfig;
  fs.removeSync(exportPath);

  // Copy static assets first, so that the built index.html overrides the its
  // template file (in case the static assets are served from the root path)
  copyStaticAssets(cosmosConfig);
  await Promise.all(corePlugins.map(plugin => plugin({ cosmosConfig })));
  exportPlaygroundFiles(cosmosConfig);

  console.log('[Cosmos] Export complete!');
  console.log(`Export path: ${cosmosConfig.exportPath}`);
}

function copyStaticAssets(cosmosConfig: CosmosConfig) {
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

  if (!fs.existsSync(staticPath)) {
    console.log(
      '[Cosmos] Warning: config.staticPath points to missing dir',
      staticPath
    );
    return;
  }

  const { publicUrl } = cosmosConfig;
  const exportStaticPath = path.resolve(
    exportPath,
    removeLeadingSlash(publicUrl)
  );
  fs.copySync(staticPath, exportStaticPath);
}

function exportPlaygroundFiles(cosmosConfig: CosmosConfig) {
  const { exportPath } = cosmosConfig;
  const pluginConfigs = getPluginConfigs(cosmosConfig);

  pluginConfigs.forEach(pluginConfig =>
    exportPlugin(cosmosConfig, pluginConfig)
  );

  fs.copySync(
    require.resolve('react-cosmos-playground2/dist'),
    path.resolve(exportPath, '_playground.js')
  );
  fs.copySync(
    getStaticPath('favicon.ico'),
    path.resolve(exportPath, '_cosmos.ico')
  );

  const playgroundHtml = getExportPlaygroundHtml(cosmosConfig, pluginConfigs);
  fs.writeFileSync(path.resolve(exportPath, 'index.html'), playgroundHtml);
}

function exportPlugin(
  cosmosConfig: CosmosConfig,
  pluginConfig: CosmosPluginConfig
) {
  const { rootDir, exportPath } = cosmosConfig;
  const pluginExportDir = path.resolve(exportPath, '_plugin');

  // Copy plugin config
  const relConfigPath = path.join(pluginConfig.rootDir, 'cosmos.plugin.json');
  const absConfigPath = path.resolve(rootDir, relConfigPath);
  fs.copySync(absConfigPath, path.resolve(pluginExportDir, relConfigPath));

  // Copy UI script
  if (pluginConfig.ui) {
    const absUiPath = path.resolve(rootDir, pluginConfig.ui);
    fs.copySync(absUiPath, path.resolve(pluginExportDir, pluginConfig.ui));
  }
}
