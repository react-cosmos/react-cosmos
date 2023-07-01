import { CosmosConfig } from 'react-cosmos';
import webpack from 'webpack';
import { resolveWebpackLoaderPath } from './resolveWebpackLoaderPath.js';
import { resolveWebpackRendererPath } from './resolveWebpackRendererPath.js';

export function getWebpackConfigModule(
  cosmosConfig: CosmosConfig,
  webpackConfig: webpack.Configuration
): webpack.ModuleOptions {
  return {
    ...webpackConfig.module,
    rules: getRules(cosmosConfig, webpackConfig),
  };
}

function getRules(
  cosmosConfig: CosmosConfig,
  { module }: webpack.Configuration
) {
  const existingRules = (module && module.rules) || [];
  return [...existingRules, getUserImportsLoaderRule(cosmosConfig)];
}

function getUserImportsLoaderRule(
  cosmosConfig: CosmosConfig
): webpack.RuleSetRule {
  return {
    loader: resolveWebpackLoaderPath(),
    include: resolveWebpackRendererPath('userImports'),
    options: { cosmosConfig },
  };
}
