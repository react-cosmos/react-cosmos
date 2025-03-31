import { CosmosConfig } from 'react-cosmos';
import { CosmosMode } from 'react-cosmos-core';
import webpack from 'webpack';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';
import { resolveWebpackLoaderPath } from './resolveWebpackLoaderPath.js';

export function getWebpackConfigModule(
  cosmosConfig: CosmosConfig,
  webpackConfig: webpack.Configuration,
  mode: CosmosMode
): webpack.ModuleOptions {
  return {
    ...webpackConfig.module,
    rules: getRules(cosmosConfig, webpackConfig, mode),
  };
}

function getRules(
  cosmosConfig: CosmosConfig,
  { module }: webpack.Configuration,
  mode: CosmosMode
) {
  const existingRules = (module && module.rules) || [];
  return [...existingRules, getUserImportsLoaderRule(cosmosConfig, mode)];
}

function getUserImportsLoaderRule(
  cosmosConfig: CosmosConfig,
  mode: CosmosMode
): webpack.RuleSetRule {
  return {
    loader: resolveWebpackLoaderPath(),
    include: resolveWebpackClientPath('userImports.js'),
    options: { cosmosConfig, mode },
  };
}
