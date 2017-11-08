import path from 'path';
import fs from 'fs-extra';
import { silent as silentImport } from 'import-from';
import extendWebpackConfig from './extend-webpack-config';
import getCosmosConfig from 'react-cosmos-config';
import { getUserWebpackConfig } from './user-webpack-config';
import getPlaygroundHtml from './playground-html';

const exportPlaygroundFiles = (cosmosConfig, outputPath) => {
  fs.copySync(
    path.join(__dirname, 'static/favicon.ico'),
    `${outputPath}/favicon.ico`
  );

  fs.copySync(
    require.resolve('react-cosmos-playground'),
    `${outputPath}/bundle.js`
  );

  const playgroundHtml = getPlaygroundHtml(cosmosConfig);
  fs.writeFileSync(`${outputPath}/index.html`, playgroundHtml);
};

const runWebpackCompiler = (webpack, config) =>
  new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });

export default function startExport() {
  const cosmosConfig = getCosmosConfig();
  const { rootPath, outputPath, publicPath, publicUrl } = cosmosConfig;

  const webpack = silentImport(rootPath, 'webpack');
  if (!webpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log('Install using "yarn add webpack" or "npm install webpack"');
    return;
  }

  const userWebpackConfig = getUserWebpackConfig(cosmosConfig);
  const loaderWebpackConfig = extendWebpackConfig({
    webpack,
    userWebpackConfig,
    shouldExport: true
  });

  // Copy static files first, so that the built index.html overrides the its
  // template file (in case the static assets are served from the root path)
  if (publicPath) {
    if (outputPath.indexOf(publicPath) === -1) {
      const exportPublicPath = path.join(outputPath, publicUrl);
      fs.copySync(publicPath, exportPublicPath);
    } else {
      console.warn(
        `[Cosmos] Warning: Can't export public path because it contains the export path! (avoiding infinite loop)`
      );
      console.warn('Public path:', publicPath);
      console.warn('Export path:', outputPath);
    }
  }

  runWebpackCompiler(webpack, loaderWebpackConfig)
    .then(() => {
      exportPlaygroundFiles(cosmosConfig, outputPath);
    })
    .then(
      () => {
        console.log('[Cosmos] Export Complete! Find the exported files here:');
        console.log(outputPath);
      },
      err => {
        console.error('[Cosmos] Export Failed! See error below:');
        console.error(err);
      }
    );
}
