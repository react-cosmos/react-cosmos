import { CosmosConfig } from 'react-cosmos';
import { CosmosMode } from 'react-cosmos-core';
import webpack from 'webpack';
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
