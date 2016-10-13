/* eslint-disable global-require */

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

  if (publicPath) {
    app.use('/', express.static(resolveUserPath(publicPath, cosmosConfigPath)));
  }

  app.listen(port, hostname, (err) => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`Listening at http://${hostname}:${port}/`);
  });
};
