import path from 'path';
import webpack from 'webpack';
import { argv } from 'yargs';
import getWebpackConfig from './webpack-config';
import getDefaultWebpackConfig from './default-webpack-config';
import importModule from 'react-cosmos-utils/lib/import-module';
import getCosmosConfig from 'react-cosmos-config';

process.env['NODE_ENV'] = 'production' // disables hmr and hot reloading

const moduleExists = modulePath => {
  try {
    return modulePath && require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
};

module.exports = function exportBundle() {
  const cosmosConfigPath = argv.config;
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);

  const {
    webpackConfigPath,
    outputPath
  } = cosmosConfig;

  let userWebpackConfig;
  if (moduleExists(webpackConfigPath)) {
    console.log(`[Cosmos Export Bundle] Using webpack config found at ${webpackConfigPath}`);
    userWebpackConfig = importModule(require(webpackConfigPath));
  } else {
    console.log('[Cosmos Export Bundle] No webpack config found, using default configuration');
    userWebpackConfig = getDefaultWebpackConfig();
  }

  const cosmosWebpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  cosmosWebpackConfig.output.path = outputPath;
  cosmosWebpackConfig.output.filename = 'loader/bundle.js';
  cosmosWebpackConfig.output.publicPath = '/';

  const compiler = webpack(cosmosWebpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
    }
    //console.log(stats)
  });
};
