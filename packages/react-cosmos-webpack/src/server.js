import path from 'path';
import fs from 'fs';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { argv } from 'yargs';
import getLoaderWebpackConfig from './loader-webpack-config';
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

const getPublicPath = (cosmosConfig, userWebpackConfig) => {
  return (
    cosmosConfig.publicPath ||
    (userWebpackConfig.devServer && userWebpackConfig.devServer.contentBase)
  );
};

module.exports = function startServer() {
  const cosmosConfigPath = argv.config;
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);

  const { hostname, hot, port, webpackConfigPath, publicUrl } = cosmosConfig;

  let userWebpackConfig;
  if (moduleExists(webpackConfigPath)) {
    console.log(`[Cosmos] Using webpack config found at ${webpackConfigPath}`);
    userWebpackConfig = importModule(require(webpackConfigPath));
  } else {
    console.log(
      '[Cosmos] No webpack config found, using default configuration'
    );
    userWebpackConfig = getDefaultWebpackConfig(cosmosConfigPath);
  }

  const loaderWebpackConfig = getLoaderWebpackConfig(
    userWebpackConfig,
    cosmosConfigPath
  );
  const loaderCompiler = webpack(loaderWebpackConfig);
  const app = express();

  app.use(
    webpackDevMiddleware(loaderCompiler, {
      publicPath: '/loader/',
      noInfo: true
    })
  );

  if (hot) {
    app.use(webpackHotMiddleware(loaderCompiler));
  }

  const publicPath = getPublicPath(cosmosConfig, userWebpackConfig);
  if (publicPath) {
    console.log(`[Cosmos] Serving static files from ${publicPath}`);
    app.use(publicUrl, express.static(publicPath));
  }

  const playgroundHtml = fs.readFileSync(
    path.join(__dirname, 'static/index.html'),
    'utf8'
  );
  const playgroundOpts = JSON.stringify({
    loaderUri: './loader/index.html'
  });

  app.get('/', (req, res) => {
    res.send(playgroundHtml.replace('__PLAYGROUND_OPTS__', playgroundOpts));
  });

  app.get('/bundle.js', (req, res) => {
    res.sendFile(require.resolve('react-cosmos-component-playground'));
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
