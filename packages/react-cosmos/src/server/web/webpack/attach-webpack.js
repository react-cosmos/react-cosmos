// @flow

import path from 'path';
import promisify from 'util.promisify';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { getRootUrl } from '../../shared/server';
import enhanceWebpackConfig from './enhance-webpack-config';

import type { Config } from 'react-cosmos-flow/config';

export function attachWebpack({
  cosmosConfig,
  app,
  webpack,
  userWebpackConfig
}: {
  cosmosConfig: Config,
  app: express$Application,
  webpack: Function,
  userWebpackConfig: Object
}) {
  const { publicUrl, hot } = cosmosConfig;

  const loaderWebpackConfig = enhanceWebpackConfig({
    webpack,
    userWebpackConfig
  });
  const webpackCompiler = webpack(loaderWebpackConfig);

  webpackCompiler.plugin('invalid', filePath => {
    // Old versions of webpack call this hook without a file path argument
    if (typeof filePath === 'string') {
      const relFilePath = path.relative(process.cwd(), filePath);
      console.log('[Cosmos] webpack build invalidated by', relFilePath);
    }
  });

  const onWebpackDone: Promise<boolean> = new Promise(resolve => {
    webpackCompiler.plugin('done', () => resolve(true));
  });

  console.log('[Cosmos] Building webpack...');
  const wdmInst = webpackDevMiddleware(webpackCompiler, {
    // publicPath is the base path for the webpack assets and has to match
    // webpack.output.path
    publicPath: getRootUrl(publicUrl),
    logLevel: 'warn'
  });

  app.use(wdmInst);

  if (hot) {
    app.use(webpackHotMiddleware(webpackCompiler));
  }

  function stopWebpack() {
    return promisify(wdmInst.close.bind(wdmInst))();
  }

  return { onWebpackDone, stopWebpack };
}
