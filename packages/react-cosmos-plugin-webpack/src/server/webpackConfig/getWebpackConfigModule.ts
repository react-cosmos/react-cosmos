import type { CosmosConfig } from 'react-cosmos';
import type { CosmosMode } from 'react-cosmos-core';
import type webpack from 'webpack';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';
import { resolveWebpackLoaderPath } from './resolveWebpackLoaderPath.js';

export function getWebpackConfigModule(
  config: CosmosConfig,
  webpackConfig: webpack.Configuration,
  mode: CosmosMode
): webpack.ModuleOptions {
  return {
    ...webpackConfig.module,
    rules: getRules(config, webpackConfig, mode),
  };
}

function getRules(
  config: CosmosConfig,
  { module }: webpack.Configuration,
  mode: CosmosMode
) {
  const existingRules = (module && module.rules) || [];
  return [...existingRules, getUserImportsLoaderRule(config, mode)];
}

function getUserImportsLoaderRule(
  config: CosmosConfig,
  mode: CosmosMode
): webpack.RuleSetRule {
  return {
    loader: resolveWebpackLoaderPath(),
    include: resolveWebpackClientPath('userImports.js'),
    options: { config, mode },
  };
}
