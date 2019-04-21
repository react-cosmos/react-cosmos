import path from 'path';
import { argv } from 'yargs';
import webpack from 'webpack';
import { CosmosConfig } from '../../../config';
import { moduleExists, requireModule } from '../../../shared/fs';
import { createWebpackCosmosConfig } from '../cosmosConfig/webpack';
import { getDefaultWebpackConfig } from './default';
import { getDefaultExport } from './module';

export function getBaseWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
) {
  const { rootDir } = cosmosConfig;
  const { configPath } = createWebpackCosmosConfig(cosmosConfig);
  if (!configPath || !moduleExists(configPath)) {
    console.log('[Cosmos] Using default webpack config');
    return getDefaultWebpackConfig(userWebpack, rootDir);
  }

  const relPath = path.relative(process.cwd(), configPath);
  console.log(`[Cosmos] Using webpack config found at ${relPath}`);

  const userConfig = getDefaultExport(requireModule(configPath));
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
  { publicUrl }: CosmosConfig,
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
