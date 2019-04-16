import path from 'path';
import promisify from 'util.promisify';
import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
import { DevServerPluginArgs } from '../../shared';
import { getRootUrl } from '../../shared/static';
import { getWebpack } from './shared';
import { getDevWebpackConfig } from './webpackConfig';

export async function webpackDevServer({
  cosmosConfig,
  expressApp
}: DevServerPluginArgs) {
  const userWebpack = getWebpack(cosmosConfig.rootDir);
  if (!userWebpack) {
    return;
  }

  const webpackConfig = getDevWebpackConfig(cosmosConfig, userWebpack);
  // const publicPath = getWebpackPublicPath(cosmosConfig, userWebpackConfig);
  // if (publicPath) {
  //   serveStaticDir(app, cosmosConfig.publicUrl, publicPath);
  // }

  const webpackCompiler = userWebpack(webpackConfig);
  webpackCompiler.hooks.invalid.tap('Cosmos', filePath => {
    const relFilePath = path.relative(process.cwd(), filePath);
    console.log('[Cosmos] webpack build invalidated by', relFilePath);
  });
  const onCompilationDone: Promise<void> = new Promise(resolve => {
    webpackCompiler.hooks.done.tap('Cosmos', () => resolve());
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
  //   expressApp.use(webpackHotMiddleware(webpackCompiler));
  // }

  await onCompilationDone;
  console.log(`[Cosmos] Server ready!`);

  return async () => {
    await promisify(wdmInst.close.bind(wdmInst))();
  };
}
