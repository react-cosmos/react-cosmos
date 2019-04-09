import path from 'path';
import fs from 'fs-extra';
import { CosmosConfig, getCosmosConfig } from './config';
import { getStaticPath } from './static';
import { getPlaygroundHtml } from './playgroundHtml';

export type ExportPluginArgs = {
  cosmosConfig: CosmosConfig;
};

export type ExportPlugin = (args: ExportPluginArgs) => unknown;

export async function generateExport(plugins: ExportPlugin[] = []) {
  const cosmosConfig = getCosmosConfig();
  try {
    // Copy static assets first, so that the built index.html overrides the its
    // template file (in case the static assets are served from the root path)
    copyStaticAssets(cosmosConfig);
    await Promise.all(plugins.map(plugin => plugin({ cosmosConfig })));
    exportPlaygroundFiles(cosmosConfig);

    console.log('[Cosmos] Export Complete! Find the exported files here:');
    console.log(cosmosConfig.exportPath);
  } catch (err) {
    console.error('[Cosmos] Export Failed!');
    console.error(err);
    process.exit(1);
  }
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
  const exportPublicPath = path.join(exportPath, publicUrl);
  fs.copySync(staticPath, exportPublicPath);
}

function exportPlaygroundFiles(cosmosConfig: CosmosConfig) {
  const { exportPath } = cosmosConfig;

  fs.copySync(
    require.resolve('react-cosmos-playground2/dist'),
    `${exportPath}/_playground.js`
  );
  fs.copySync(getStaticPath('favicon.ico'), `${exportPath}/_cosmos.ico`);

  const playgroundHtml = getPlaygroundHtml(cosmosConfig, false);
  fs.writeFileSync(`${exportPath}/index.html`, playgroundHtml);
}
