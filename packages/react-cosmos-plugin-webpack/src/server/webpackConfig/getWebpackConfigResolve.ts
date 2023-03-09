import path from 'path';
import { CosmosConfig } from 'react-cosmos/server.js';
import webpack from 'webpack';
import { resolveFromSilent } from '../utils/resolveSilent.js';

export function getWebpackConfigResolve(
  cosmosConfig: CosmosConfig,
  webpackConfig: webpack.Configuration
): webpack.ResolveOptions {
  return removeModuleScopePlugin(
    resolveLocalReactDeps(cosmosConfig, webpackConfig.resolve)
  );
}

function removeModuleScopePlugin(
  resolve: webpack.ResolveOptions = {}
): webpack.ResolveOptions {
  const { plugins } = resolve;
  if (!plugins) return resolve;
  return {
    ...resolve,
    plugins: plugins.filter(
      p => !isInstanceOfResolvePlugin(p, 'ModuleScopePlugin')
    ),
  };
}

function resolveLocalReactDeps(
  cosmosConfig: CosmosConfig,
  resolve: webpack.ResolveOptions = {}
): webpack.ResolveOptions {
  const { rootDir } = cosmosConfig;

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
    const reactPath = resolveFromSilent(rootDir, 'react');
    if (!reactPath)
      throw new Error(`[Cosmos] Local dependency not found: react`);
    alias = addAlias(alias, 'react', path.dirname(reactPath));
  }

  if (reactDomAlias) {
    console.log('[Cosmos] React DOM alias found in webpack config');
  } else {
    const reactDomPath = resolveFromSilent(rootDir, 'react-dom');
    if (!reactDomPath)
      throw new Error(`[Cosmos] Local dependency not found: react-dom`);
    alias = addAlias(alias, 'react-dom', path.dirname(reactDomPath));
  }

  return { ...resolve, alias };
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

export function isInstanceOfResolvePlugin(
  plugin: webpack.ResolvePluginInstance | '...',
  constructorName: string
) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}
