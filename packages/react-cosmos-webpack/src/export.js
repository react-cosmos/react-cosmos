import path from 'path';
import webpack from 'webpack';
import { argv } from 'yargs';
import getWebpackConfig from './webpack-config';
import getDefaultWebpackConfig from './default-webpack-config';
import importModule from 'react-cosmos-utils/lib/import-module';
import getCosmosConfig from 'react-cosmos-config';
import fs from 'fs-extra';

process.env['NODE_ENV'] = 'production';

const moduleExists = modulePath => {
  try {
    return modulePath && require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
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
    console.log(`[Cosmos Export] Using webpack config found at ${webpackConfigPath}`);
    userWebpackConfig = importModule(require(webpackConfigPath));
  } else {
    console.log('[Cosmos Export] No webpack config found, using default configuration');
    userWebpackConfig = getDefaultWebpackConfig();
  }

  const cosmosWebpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath, true);
  const compiler = webpack(cosmosWebpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.error('Export Failed! See error below:');
      console.error(err);
    } else {
      try {
        fs.copySync(path.join(__dirname, 'static/favicon.ico'), `${cosmosWebpackConfig.output.path}/favicon.ico`);
        fs.copySync(`${cosmosWebpackConfig.output.path}/bundle.js`, `${cosmosWebpackConfig.output.path}/loader/bundle.js`);
        fs.removeSync(`${cosmosWebpackConfig.output.path}/bundle.js`);
      } catch (err) {
        console.error('Export Failed! See error below:');
        console.error(err);
      }
      console.log(`Export Complete! Find the exported files here:
${cosmosWebpackConfig.output.path}`);
    }
  });

};