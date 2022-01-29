import path from 'path';
import resolveFrom from 'resolve-from';
import webpack from 'webpack';
import { CosmosConfig } from '../../../config';
import { getCliArgs } from '../../../shared/cli';
import { moduleExists, requireModule } from '../../../shared/fs';
import { createWebpackCosmosConfig } from '../cosmosConfig/webpack';
import { getDefaultWebpackConfig } from './default';
import { getDefaultExport } from './module';

type WebpackConfigExport =
  | webpack.Configuration
  // Mirror webpack API for config functions
  // https://webpack.js.org/configuration/configuration-types/#exporting-a-function
  | ((
      env: unknown,
      _argv: {}
    ) => webpack.Configuration | Promise<webpack.Configuration>);

// Override arguments are inspired by react-app-rewired
// https://github.com/timarney/react-app-rewired/blob/b673379d32fe7b57c71667f4827f3b16e3717363/scripts/start.js#L22
type WebpackOverride = (
  baseConfig: webpack.Configuration,
  env: string
) => webpack.Configuration;

export async function getUserWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
) {
  const baseWebpackConfig = await getBaseWebpackConfig(
    cosmosConfig,
    userWebpack
  );
  const { overridePath } = createWebpackCosmosConfig(cosmosConfig);

  if (!overridePath || !moduleExists(overridePath)) {
    return baseWebpackConfig;
  }

  const relPath = path.relative(process.cwd(), overridePath);
  console.log(`[Cosmos] Overriding webpack config at ${relPath}`);
  const webpackOverride = getDefaultExport(
    requireModule(overridePath)
  ) as WebpackOverride;

  return webpackOverride(baseWebpackConfig, getNodeEnv());
}

export async function getBaseWebpackConfig(
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

  const userConfigExport = getDefaultExport(
    requireModule(configPath)
  ) as WebpackConfigExport;
  const cliArgs = getCliArgs();
  return typeof userConfigExport === 'function'
    ? await userConfigExport(cliArgs.env || getNodeEnv(), cliArgs)
    : userConfigExport;
}

export function resolveClientPath(relPath: string) {
  return require.resolve(`../client/${relPath}`);
}

export function getUserDepsLoaderRule(): webpack.RuleSetRule {
  return {
    loader: require.resolve('./userDepsLoader'),
    include: resolveClientPath('userDeps'),
  };
}

export function resolveLocalReactDeps(
  cosmosConfig: CosmosConfig,
  baseWebpackConfig: webpack.Configuration
): webpack.ResolveOptions {
  const { rootDir } = cosmosConfig;

  const { resolve = {} } = baseWebpackConfig;
  let alias = resolve.alias || {};

  // Preserve existing React aliases (eg. when using Preact)
  let reactAlias = hasAlias(alias, 'react');
  let reactDomAlias = hasAlias(alias, 'react-dom');

  if (reactAlias && reactDomAlias) {
    console.log('[Cosmos] React and React DOM aliases found in webpack config');
    return resolve;
  }

  if (reactAlias) {
    console.log('[Cosmos] React alias found in webpack config');
  } else {
    const reactPath = resolveFrom.silent(rootDir, 'react');
    if (!reactPath)
      throw new Error(`[Cosmos] Local dependency not found: react`);
    alias = addAlias(alias, 'react', path.dirname(reactPath));
  }

  if (reactDomAlias) {
    console.log('[Cosmos] React DOM alias found in webpack config');
  } else {
    const reactDomPath = resolveFrom.silent(rootDir, 'react-dom');
    if (!reactDomPath)
      throw new Error(`[Cosmos] Local dependency not found: react-dom`);
    alias = addAlias(alias, 'react-dom', path.dirname(reactDomPath));
  }

  return { ...resolve, alias };
}

export function getGlobalsPlugin(
  { publicUrl }: CosmosConfig,
  userWebpack: typeof webpack,
  devServerOn: boolean
) {
  const cleanPublicUrl = removeTrailingSlash(publicUrl);
  return new userWebpack.DefinePlugin({
    // "if (__DEV__)" blocks get stripped when compiling a static export build
    __DEV__: JSON.stringify(devServerOn),
    'process.env': {
      NODE_ENV: JSON.stringify(getNodeEnv()),
      PUBLIC_URL: JSON.stringify(cleanPublicUrl),
    },
  });
}

export function hasPlugin(
  plugins: void | webpack.WebpackPluginInstance[],
  pluginName: string
) {
  return (
    plugins && plugins.filter(p => isInstanceOfPlugin(p, pluginName)).length > 0
  );
}

export function isInstanceOfPlugin(
  plugin: webpack.WebpackPluginInstance,
  constructorName: string
) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}

function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, '');
}

export function getNodeEnv() {
  // Disallow non dev/prod environments, like "test" inside Jest, because
  // they are not supported by webpack
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

function hasAlias(alias: webpack.ResolveOptions['alias'], name: string) {
  if (!alias) return false;

  const exactName = `${name}$`;
  if (Array.isArray(alias)) {
    return alias.some(a => a.name === name || a.name === exactName);
  } else {
    const keys = Object.keys(alias);
    return keys.includes(name) || keys.includes(exactName);
  }
}

function addAlias(
  alias: webpack.ResolveOptions['alias'],
  name: string,
  value: string | false | string[]
) {
  return Array.isArray(alias)
    ? [...alias, { name, alias: value }]
    : { ...alias, [name]: value };
}
