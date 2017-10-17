import path from 'path';
import fs from 'fs';
import { silent as silentImport } from 'import-from';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import importModule from 'react-cosmos-utils/lib/import-module';
import moduleExists from 'react-cosmos-utils/lib/module-exists';
import getCosmosConfig from 'react-cosmos-config';
import extendWebpackConfig from '../server/extend-webpack-config';
import getDefaultWebpackConfig from '../server/default-webpack-config';

const getPublicPath = (cosmosConfig, userWebpackConfig) => {
  return (
    cosmosConfig.publicPath ||
    (userWebpackConfig.devServer && userWebpackConfig.devServer.contentBase)
  );
};

export default function startServer() {
  const cosmosConfig = getCosmosConfig();
  const {
    rootPath,
    hostname,
    hot,
    port,
    webpackConfigPath,
    publicUrl
  } = cosmosConfig;

  const webpack = silentImport(rootPath, 'webpack');
  if (!webpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log('Install using "yarn add webpack" or "npm install webpack"');
    return;
  }

  let userWebpackConfig;
  if (moduleExists(webpackConfigPath)) {
    console.log(`[Cosmos] Using webpack config found at ${webpackConfigPath}`);
    userWebpackConfig = importModule(require(webpackConfigPath));
  } else {
    console.log('[Cosmos] No webpack config found, using default config');
    userWebpackConfig = getDefaultWebpackConfig(rootPath);
  }

  if (cosmosConfig.proxies) {
    console.warn('[Cosmos] Warning: config.proxies is deprecated!');
    console.warn(
      'Please check latest proxy docs: https://github.com/react-cosmos/react-cosmos#proxies'
    );
  }

  const loaderWebpackConfig = extendWebpackConfig({
    webpack,
    userWebpackConfig
  });
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
}
