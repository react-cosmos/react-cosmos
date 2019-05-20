import path from 'path';
import promisify from 'util.promisify';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { resolvePath } from '../../config';
import { DevServerPluginArgs } from '../../shared/devServer';
import { getRootUrl, serveStaticDir } from '../../shared/static';
import { getWebpack } from './shared';
import { createWebpackCosmosConfig } from './cosmosConfig/webpack';
import { getDevWebpackConfig } from './webpackConfig';

export async function webpackDevServer({
  cosmosConfig,
  expressApp,
  sendBuildMessage
}: DevServerPluginArgs) {
  const userWebpack = getWebpack(cosmosConfig.rootDir);
  if (!userWebpack) {
    return;
  }

  const webpackConfig = getDevWebpackConfig(cosmosConfig, userWebpack);

  // Serve static path derived from devServer.contentBase webpack config
  if (cosmosConfig.staticPath === null) {
    const staticPath = getWebpackStaticPath(webpackConfig);
    if (staticPath !== null) {
      serveStaticDir(
        expressApp,
        resolvePath(cosmosConfig.rootDir, staticPath),
        cosmosConfig.publicUrl
      );
    }
  }

  const webpackCompiler = userWebpack(webpackConfig);
  webpackCompiler.hooks.invalid.tap('Cosmos', filePath => {
    const relFilePath = path.relative(process.cwd(), filePath);
    console.log('[Cosmos] webpack build invalidated by', relFilePath);
    sendBuildMessage({ type: 'buildStart' });
  });
  webpackCompiler.hooks.failed.tap('Cosmos', () => {
    sendBuildMessage({ type: 'buildError' });
  });
  const onCompilationDone: Promise<void> = new Promise(resolve => {
    webpackCompiler.hooks.done.tap('Cosmos', stats => {
      resolve();
      if (stats.hasErrors()) {
        sendBuildMessage({ type: 'buildError' });
      } else {
        sendBuildMessage({ type: 'buildDone' });
      }
    });
  });

  console.log('[Cosmos] Building webpack...');
  const wdmInst = webpackDevMiddleware(webpackCompiler, {
    // publicPath is the base path for the webpack assets and has to match
    // webpack.output.path
    publicPath: getRootUrl(cosmosConfig.publicUrl),
    logLevel: 'warn'
  });

  expressApp.use(wdmInst);

  const { hotReload } = createWebpackCosmosConfig(cosmosConfig);
  if (hotReload) {
    expressApp.use(webpackHotMiddleware(webpackCompiler));
  }

  await onCompilationDone;

  return async () => {
    await promisify(wdmInst.close.bind(wdmInst))();
  };
}

function getWebpackStaticPath({ devServer }: webpack.Configuration) {
  return devServer && typeof devServer.contentBase === 'string'
    ? devServer.contentBase
    : null;
}
