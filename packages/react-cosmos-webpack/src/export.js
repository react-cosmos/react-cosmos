import path from 'path';
import webpack from 'webpack';
import { argv } from 'yargs';
import fs from 'fs-extra';
import getWebpackConfig from './webpack-config';
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

const arrangeExportInOutputPath = outputPath => {
  fs.copySync(`${outputPath}/bundle.js`, `${outputPath}/loader/bundle.js`);
  fs.copySync(`${outputPath}/index.html`, `${outputPath}/loader/index.html`);
  fs.removeSync(`${outputPath}/bundle.js`);
  fs.removeSync(`${outputPath}/index.html`);
  fs.copySync(path.join(__dirname, 'static/favicon.ico'), `${outputPath}/favicon.ico`);
  fs.copySync(path.join(__dirname, 'static/index.html'), `${outputPath}/index.html`);
};

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

  const cosmosWebpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath, true);
  const compiler = webpack(cosmosWebpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.error('[Cosmos] Export Failed! See error below:');
      console.error(err);
    } else {
      console.log(stats);
      try {
        arrangeExportInOutputPath(outputPath);
      } catch (err) {
        console.error('[Cosmos] Export Failed! See error below:');
        console.error(err);
      }
      console.log(`[Cosmos] Export Complete! Find the exported files here:
${outputPath}`);
    }
  });
};
