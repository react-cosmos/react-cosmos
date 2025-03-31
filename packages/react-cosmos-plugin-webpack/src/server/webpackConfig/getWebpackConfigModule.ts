import { CosmosConfig } from 'react-cosmos';
import { CosmosCommand } from 'react-cosmos-core';
import webpack from 'webpack';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';
import { resolveWebpackLoaderPath } from './resolveWebpackLoaderPath.js';

export function getWebpackConfigModule(
  cosmosConfig: CosmosConfig,
  cosmosCommand: CosmosCommand,
  webpackConfig: webpack.Configuration
): webpack.ModuleOptions {
  return {
    ...webpackConfig.module,
    rules: getRules(cosmosConfig, cosmosCommand, webpackConfig),
  };
}

function getRules(
  cosmosConfig: CosmosConfig,
  cosmosCommand: CosmosCommand,
  { module }: webpack.Configuration
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
    include: resolveWebpackClientPath('userImports.js'),
    options: { cosmosConfig, cosmosCommand },
  };
}
