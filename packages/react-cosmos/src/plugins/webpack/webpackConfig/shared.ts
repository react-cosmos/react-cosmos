import path from 'path';
import { argv } from 'yargs';
import webpack from 'webpack';
import { WebpackCosmosConfig } from '../config';
import { getDefaultWebpackConfig } from './default';
import { moduleExists, getDefaultExport } from './module';

export function getBaseWebpackConfig(
  cosmosConfig: WebpackCosmosConfig,
  userWebpack: typeof webpack
) {
  const { rootDir, webpackConfigPath } = cosmosConfig;
  if (!webpackConfigPath) {
    console.log('[Cosmos] Using default webpack config');
    return getDefaultWebpackConfig(userWebpack, rootDir);
  }

  // TODO: Ensure path is absolute
  if (!moduleExists(webpackConfigPath)) {
    throw new Error(`Invalid webpack config path: ${webpackConfigPath}`);
  }

  const relPath = path.relative(process.cwd(), webpackConfigPath);
  console.log(`[Cosmos] Using webpack config found at ${relPath}`);

  const userConfig = getDefaultExport(require(webpackConfigPath));
  return typeof userConfig === 'function'
    ? userConfig(process.env.NODE_ENV, argv)
    : userConfig;
}

export function resolveDomRendererPath(relPath: string) {
  return require.resolve(`../../../domRenderer/${relPath}`);
}

export function resolveClientPath(relPath: string) {
  return require.resolve(`../client/${relPath}`);
}

export function getUserDepsLoaderRule() {
  return {
    loader: require.resolve('./userDepsLoader'),
    include: resolveClientPath('userDeps')
  };
}

export function getEnvVarPlugin(
  { publicUrl }: WebpackCosmosConfig,
  userWebpack: typeof webpack,
  isDev: boolean
) {
  const cleanPublicUrl = removeTrailingSlash(publicUrl);
  return new userWebpack.DefinePlugin({
    // Having __DEV__ as boolean is useful because "if (__DEV__)" blocks can
    // get stripped automatically when compiling a static export build
    __DEV__: JSON.stringify(isDev),
    'process.env': {
      NODE_ENV: JSON.stringify(isDev ? 'development' : 'production'),
      PUBLIC_URL: JSON.stringify(cleanPublicUrl)
    }
  });
}

export function hasPlugin(
  plugins: void | webpack.Plugin[],
  pluginName: string
) {
  return (
    plugins && plugins.filter(p => isInstanceOfPlugin(p, pluginName)).length > 0
  );
}

export function isInstanceOfPlugin(
  plugin: webpack.Plugin,
  constructorName: string
) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}

function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, '');
}
