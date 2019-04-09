// TODO: Test if a webpack import (require) is kept in the compiled file
import webpack from 'webpack';
import { DevServerPluginArgs, ExportPluginArgs } from '../../shared';
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

export async function webpackExport({ cosmosConfig }: ExportPluginArgs) {
  const userWebpack = getWebpack(cosmosConfig.rootDir);
  if (!userWebpack) {
    return;
  }

  const webpackConfig = getWebpackConfig({
    cosmosConfig,
    userWebpack,
    staticBuild: true
  });

  try {
    await runWebpackCompiler(userWebpack, webpackConfig);
  } catch (err) {
    const webpackError = err as WebpackCompilationError;
    if (webpackError.webpackErrors) {
      webpackError.webpackErrors.forEach(error => {
        console.error(`${error}\n`);
      });
    }
    throw webpackError;
  }
}

function runWebpackCompiler(
  userWebpack: typeof webpack,
  webpackConfig: webpack.Configuration
) {
  return new Promise((resolve, reject) => {
    const compiler = userWebpack(webpackConfig);
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        const error = new WebpackCompilationError();
        error.webpackErrors = stats.toJson().errors;
        reject(error);
      } else {
        resolve(stats);
      }
    });
  });
}

class WebpackCompilationError extends Error {
  webpackErrors?: string[];
  constructor() {
    super('Webpack errors occurred');
  }
}
