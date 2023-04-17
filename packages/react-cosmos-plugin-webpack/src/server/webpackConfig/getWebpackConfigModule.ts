import { CosmosConfig } from 'react-cosmos/dist/index.js';
import webpack from 'webpack';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';
import { resolveWebpackLoaderPath } from './resolveWebpackLoaderPath.js';

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
  return [...existingRules, getUserDepsLoaderRule(cosmosConfig)];
}

function getUserDepsLoaderRule(
  cosmosConfig: CosmosConfig
): webpack.RuleSetRule {
  return {
    loader: resolveWebpackLoaderPath(),
    include: resolveWebpackClientPath('userDeps'),
    options: { cosmosConfig },
  };
}
