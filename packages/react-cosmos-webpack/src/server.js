/* eslint-disable global-require */

import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { argv } from 'yargs';
import getConfig from './config';
import getWebpackConfig from './webpack-config';

/**
 * Resolve path from user config if it isn't already absolute.
 * This allows users to use any of the following forms to express their paths:
 * - componentsPaths: ['src/components']
 * - componentsPaths: [path.join(__dirname, 'src/components')]
 */
const resolveUserPath = (userPath, root) => {
  if (path.isAbsolute(userPath)) {
    return userPath;
  }

  return path.join(root, userPath);
};

module.exports = function startServer() {
  const cosmosConfigPath =
    resolveUserPath(argv.config || 'cosmos.config', process.cwd());
  const cosmosConfig = getConfig(require(cosmosConfigPath));

  // Our best bet is to resolve relative user paths to the parent dir of their
  // cosmos config, *assuming* that's their root path. Users also have the
  // option to use absolute config paths if this doesn't work well in some cases.
  const projectRootPath = path.dirname(cosmosConfigPath);

  const {
    hostname,
    hot,
    port,
    publicPath,
    webpackConfigPath,
  } = cosmosConfig;

  const userWebpackConfig = require(resolveUserPath(webpackConfigPath, projectRootPath));
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
    app.use('/', express.static(publicPath));
  }

  app.listen(port, hostname, (err) => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`Listening at http://${hostname}:${port}/`);
  });
};
