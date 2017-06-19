import path from 'path';
import webpack from 'webpack';
import { argv } from 'yargs';
import fs from 'fs-extra';
import getLoaderWebpackConfig from './loader-webpack-config';
import getPlaygroundWebpackConfig from './webpack-config-playground';
import getDefaultWebpackConfig from './default-webpack-config';
import importModule from 'react-cosmos-utils/lib/import-module';
import getCosmosConfig from 'react-cosmos-config';

const moduleExists = modulePath => {
  try {
    return modulePath && require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
};

const copyStaticFiles = outputPath => {
  fs.copySync(path.join(__dirname, 'static/favicon.ico'), `${outputPath}/favicon.ico`);
  fs.copySync(path.join(__dirname, 'static/index.html'), `${outputPath}/index.html`);
};

const runWebpackCompiler = config =>
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

module.exports = function startExport() {
  const cosmosConfigPath = argv.config;
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);

  const {
    webpackConfigPath,
    outputPath
  } = cosmosConfig;

  let userWebpackConfig;
  if (moduleExists(webpackConfigPath)) {
    console.log(`[Cosmos] Using webpack config found at ${webpackConfigPath}`);
    userWebpackConfig = importModule(require(webpackConfigPath));
  } else {
    console.log('[Cosmos] No webpack config found, using default configuration');
    userWebpackConfig = getDefaultWebpackConfig();
  }

  const loaderWebpackConfig = getLoaderWebpackConfig(userWebpackConfig, cosmosConfigPath, true);
  const playgroundWebpackConfig = getPlaygroundWebpackConfig(cosmosConfigPath, true);

  Promise.all([
    runWebpackCompiler(loaderWebpackConfig),
    runWebpackCompiler(playgroundWebpackConfig),
  ]).then(() => {
    copyStaticFiles(outputPath);
  }).then(() => {
    console.log('[Cosmos] Export Complete! Find the exported files here:');
    console.log(outputPath);
  }, err => {
    console.error('[Cosmos] Export Failed! See error below:');
    console.error(err);
  });
};
