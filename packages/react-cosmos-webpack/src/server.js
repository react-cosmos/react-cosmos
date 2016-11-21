/* eslint-disable global-require, no-console */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { argv } from 'yargs';
import getConfig from './config';
import resolveUserPath from './resolve-user-path';
import getWebpackConfig from './webpack-config';

module.exports = function startServer() {
  const cosmosConfigPath = resolveUserPath(argv.config || 'cosmos.config');
  const cosmosConfig = getConfig(require(cosmosConfigPath));

  const {
    hostname,
    hot,
    port,
    publicPath,
    webpackConfigPath,
  } = cosmosConfig;

  const userWebpackConfig = require(resolveUserPath(webpackConfigPath, cosmosConfigPath));
  const cosmosWebpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  const compiler = webpack(cosmosWebpackConfig);
  const app = express();

  app.use(webpackDevMiddleware(compiler, {
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
    console.log(`Serving static files from ${resolvedPublicPath}`);
    app.use('/', express.static(resolvedPublicPath));
  }

  app.listen(port, hostname, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening at http://${hostname}:${port}/`);
  });
};
