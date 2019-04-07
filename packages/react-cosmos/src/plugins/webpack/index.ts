import { DevServerPluginArgs } from '../../shared';
import { getWebpack } from './shared';
import { getWebpackConfig } from './webpackConfig';
import { attachWebpack } from './attachWebpack';

export function webpackServer({
  cosmosConfig,
  expressApp
}: DevServerPluginArgs) {
  const userWebpack = getWebpack(cosmosConfig.rootDir);
  if (!userWebpack) {
    return;
  }

  const webpackConfig = getWebpackConfig({
    cosmosConfig,
    userWebpack,
    staticBuild: false
  });
  // const publicPath = getWebpackPublicPath(cosmosConfig, userWebpackConfig);
  // if (publicPath) {
  //   serveStaticDir(app, cosmosConfig.publicUrl, publicPath);
  // }

  // const { onWebpackDone, stopWebpack } = attachWebpack({
  const { stopWebpack } = attachWebpack({
    cosmosConfig,
    expressApp,
    userWebpack,
    webpackConfig
  });

  // TODO: Is awaiting needed?
  // await onWebpackDone;

  return () => {
    stopWebpack();
  };
}
