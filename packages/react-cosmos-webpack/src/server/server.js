import path from 'path';
import fs from 'fs';
import { silent as silentImport } from 'import-from';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getCosmosConfig from 'react-cosmos-config';
import extendWebpackConfig from './extend-webpack-config';
import getUserWebpackConfig from './user-webpack-config';

const getPublicPath = (cosmosConfig, userWebpackConfig) => {
  return (
    cosmosConfig.publicPath ||
    (userWebpackConfig.devServer && userWebpackConfig.devServer.contentBase)
  );
};

export default function startServer() {
  const cosmosConfig = getCosmosConfig();
  const { rootPath, hostname, hot, port, publicUrl } = cosmosConfig;

  const webpack = silentImport(rootPath, 'webpack');
  if (!webpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log('Install using "yarn add webpack" or "npm install webpack"');
    return;
  }

  if (cosmosConfig.proxies) {
    console.warn('[Cosmos] Warning: config.proxies is deprecated!');
    console.warn(
      'Please check latest proxy docs: https://github.com/react-cosmos/react-cosmos#proxies'
    );
  }

  const userWebpackConfig = getUserWebpackConfig(cosmosConfig);
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
    res.sendFile(require.resolve('react-cosmos-playground'));
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
