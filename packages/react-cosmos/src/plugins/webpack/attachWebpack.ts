import path from 'path';
import promisify from 'util.promisify';
import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
import { CosmosConfig } from '../../shared/config';
import { getRootUrl } from '../../shared/static';

export function attachWebpack({
  cosmosConfig,
  expressApp,
  userWebpack,
  webpackConfig
}: {
  cosmosConfig: CosmosConfig;
  expressApp: express.Application;
  userWebpack: typeof webpack;
  webpackConfig: webpack.Configuration;
}) {
  const webpackCompiler = userWebpack(webpackConfig);

  webpackCompiler.hooks.invalid.tap('Cosmos', filePath => {
    const relFilePath = path.relative(process.cwd(), filePath);
    console.log('[Cosmos] webpack build invalidated by', relFilePath);
  });

  const onWebpackDone: Promise<boolean> = new Promise(resolve => {
    webpackCompiler.hooks.done.tap('Cosmos', () => resolve(true));
  });

  console.log('[Cosmos] Building webpack...');
  const wdmInst = webpackDevMiddleware(webpackCompiler, {
    // publicPath is the base path for the webpack assets and has to match
    // webpack.output.path
    publicPath: getRootUrl(cosmosConfig.publicUrl),
    logLevel: 'warn'
  });

  expressApp.use(wdmInst);

  // if (cosmosConfig.hotReload) {
  //   app.use(webpackHotMiddleware(webpackCompiler));
  // }

  function stopWebpack() {
    return promisify(wdmInst.close.bind(wdmInst))();
  }

  return { onWebpackDone, stopWebpack };
}
