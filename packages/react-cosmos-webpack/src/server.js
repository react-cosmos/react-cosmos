/* eslint-disable global-require, no-console */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { argv } from 'yargs';
import getConfig from './config';
import resolveUserPath from './utils/resolve-user-path';
import buildModulePaths from './build-module-paths';
import getLoaderWebpackConfig from './loader/webpack-config';
import getPlaygroundWebpackConfig from './playground/webpack-config';

module.exports = function startServer() {
  const cosmosConfigPath = resolveUserPath(argv.config || 'cosmos.config');
  const cosmosConfig = getConfig(require(cosmosConfigPath));

  const {
    componentPaths,
    hostname,
    hot,
    ignore,
    port,
    publicPath,
    webpackConfigPath,
  } = cosmosConfig;

  const resolvedComponentPaths = componentPaths.map(
    path => resolveUserPath(path, cosmosConfigPath));
  const modulePaths = buildModulePaths(resolvedComponentPaths, ignore);

  const userWebpackConfig = require(resolveUserPath(webpackConfigPath, cosmosConfigPath));
  const cosmosLoaderWebpackConfig = getLoaderWebpackConfig(
    modulePaths, userWebpackConfig, cosmosConfigPath
  );
  const playgroundWebpackConfig = getPlaygroundWebpackConfig(modulePaths, userWebpackConfig);
  const loaderCompiler = webpack(cosmosLoaderWebpackConfig);
  const playgroundCompiler = webpack(playgroundWebpackConfig);

  const app = express();
  app.use(webpackDevMiddleware(loaderCompiler, {
    publicPath: '/loader/',
    noInfo: true,
  }));
  app.use(webpackDevMiddleware(playgroundCompiler, {
    publicPath: '/',
    noInfo: true,
  }));

  if (hot) {
    app.use(webpackHotMiddleware(loaderCompiler));
  }

  let inferredPublicPath = publicPath;
  if (!inferredPublicPath &&
      userWebpackConfig.devServer && userWebpackConfig.devServer.contentBase) {
    inferredPublicPath = userWebpackConfig.devServer.contentBase;
  }

  if (inferredPublicPath) {
    const resolvedPublicPath = resolveUserPath(inferredPublicPath, cosmosConfigPath);
    console.log(`Serving static files from ${resolvedPublicPath}`);
    app.use('/loader/', express.static(resolvedPublicPath));
  }

  app.listen(port, hostname, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening at http://${hostname}:${port}/`);
  });
};
