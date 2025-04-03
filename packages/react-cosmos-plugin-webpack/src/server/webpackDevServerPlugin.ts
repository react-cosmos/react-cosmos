import path from 'path';
import { DevServerPluginArgs, serveStaticDir } from 'react-cosmos';
import { ServerMessage } from 'react-cosmos-core';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { createWebpackCosmosConfig } from './cosmosConfig/createWebpackCosmosConfig.js';
import { getWebpack } from './getWebpack.js';
import { getDevWebpackConfig } from './webpackConfig/getDevWebpackConfig.js';

type WebpackConfig = webpack.Configuration & {
  // webpack-dev-server options (no need to install WDS just for these types)
  devServer: {
    contentBase: string;
  };
};

export async function webpackDevServerPlugin({
  config,
  platform,
  app,
  sendMessage,
}: DevServerPluginArgs) {
  if (platform !== 'web') return;

  const userWebpack = getWebpack(config.rootDir);
  if (!userWebpack) return;

  const webpackConfig = (await getDevWebpackConfig(
    config,
    userWebpack
  )) as WebpackConfig;

  // Serve static path derived from devServer.contentBase webpack config
  if (config.staticPath === null) {
    const webpackDerivedStaticPath = getWebpackStaticPath(webpackConfig);
    if (webpackDerivedStaticPath !== null) {
      serveStaticDir(
        app,
        path.resolve(config.rootDir, webpackDerivedStaticPath),
        config.publicUrl
      );
    }
  }

  function sendBuildMessage(msg: ServerMessage) {
    sendMessage(msg);
  }

  const webpackCompiler = userWebpack(webpackConfig);
  webpackCompiler.hooks.invalid.tap('Cosmos', filePath => {
    if (typeof filePath === 'string') {
      const relFilePath = path.relative(process.cwd(), filePath);
      console.log('[Cosmos] webpack build invalidated by', relFilePath);
    } else {
      console.log('[Cosmos] webpack build invalidated by unknown file');
    }
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

  // Why import WDM here instead of at module level? Because it imports webpack,
  // which might not be installed in the user's codebase. If this were to happen
  // the Cosmos server would crash with a cryptic import error. See import here:
  // https://github.com/webpack/webpack-dev-middleware/blob/eb2e32bab57df11bdfbbac19474eb16817d504fe/lib/fs.js#L8
  // Instead, prior to importing WDM we check if webpack is installed and fail
  // gracefully if not.
  const wdmModule = await import('webpack-dev-middleware');
  const wdmInst = wdmModule.default(webpackCompiler as any, {
    // publicPath is the base path for the webpack assets and has to match
    // webpack.output.publicPath
    publicPath: config.publicUrl,
  });

  app.use(wdmInst);

  const { hotReload } = createWebpackCosmosConfig(config);
  if (hotReload) {
    app.use(webpackHotMiddleware(webpackCompiler));
  }

  await onCompilationDone;

  return async () => {
    await new Promise(res => wdmInst.close(res));
  };
}

function getWebpackStaticPath({ devServer }: WebpackConfig) {
  return devServer && typeof devServer.contentBase === 'string'
    ? devServer.contentBase
    : null;
}
