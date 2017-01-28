import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { argv } from 'yargs';
import getConfig from './config';
import resolveUserPath from './utils/resolve-user-path';
import getWebpackConfig from './webpack-config';
import getDefaultWebpackConfig from './default-webpack-config';
import importModule from 'react-cosmos-utils/lib/import-module';

const moduleExists = modulePath => {
  try {
    return require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
};

module.exports = function startServer() {
  const cosmosConfigPath = resolveUserPath(argv.config || 'cosmos.config');
  const cosmosConfig = getConfig(importModule(require(cosmosConfigPath)));

  const {
    hostname,
    hot,
    port,
    publicPath,
    webpackConfigPath,
  } = cosmosConfig;

  const userWebpackConfigPath = resolveUserPath(webpackConfigPath, cosmosConfigPath);
  let userWebpackConfig;

  if (moduleExists(userWebpackConfigPath)) {
    console.log(`[Cosmos] Using webpack config found at ${userWebpackConfigPath}`);
    userWebpackConfig = importModule(require(userWebpackConfigPath));
  } else {
    console.log('[Cosmos] No webpack config found, using default configuration');
    userWebpackConfig = getDefaultWebpackConfig();
  }

  const cosmosWebpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  const compiler = webpack(cosmosWebpackConfig);
  const app = express();

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/loader/',
    noInfo: true,
  }));

  if (hot) {
    app.use(webpackHotMiddleware(compiler));
  }

  let inferredPublicPath = publicPath;
  if (!inferredPublicPath &&
      userWebpackConfig.devServer && userWebpackConfig.devServer.contentBase) {
    inferredPublicPath = userWebpackConfig.devServer.contentBase;
  }

  if (inferredPublicPath) {
    const resolvedPublicPath = resolveUserPath(inferredPublicPath, cosmosConfigPath);
    console.log(`[Cosmos] Serving static files from ${resolvedPublicPath}`);
    app.use('/loader/', express.static(resolvedPublicPath));
  }

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'));
  });

  app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/favicon.ico'));
  });

  app.listen(port, hostname, err => {
    if (err) {
      throw err;
    }
    console.log(`[Cosmos] See you at http://${hostname}:${port}/`);
  });
};
