import { CosmosCommand, CosmosConfig } from 'react-cosmos';
import webpack from 'webpack';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';
import { resolveWebpackLoaderPath } from './resolveWebpackLoaderPath.js';

export function getWebpackConfigModule(
  cosmosConfig: CosmosConfig,
  webpackConfig: webpack.Configuration,
  cosmosCommand: CosmosCommand
): webpack.ModuleOptions {
  return {
    ...webpackConfig.module,
    rules: getRules(cosmosConfig, webpackConfig, cosmosCommand),
  };
}

function getRules(
  cosmosConfig: CosmosConfig,
  { module }: webpack.Configuration,
  cosmosCommand: CosmosCommand
) {
  const existingRules = (module && module.rules) || [];
  return [
    ...existingRules,
    getUserImportsLoaderRule(cosmosConfig, cosmosCommand),
  ];
}

function getUserImportsLoaderRule(
  cosmosConfig: CosmosConfig,
  cosmosCommand: CosmosCommand
): webpack.RuleSetRule {
  return {
    loader: resolveWebpackLoaderPath(),
    include: resolveWebpackClientPath('userImports'),
    options: { cosmosConfig, cosmosCommand },
  };
}
