import webpack from 'webpack';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';
import { resolveWebpackLoaderPath } from './resolveWebpackLoaderPath.js';

export function getWebpackConfigModule(
  webpackConfig: webpack.Configuration
): webpack.ModuleOptions {
  return {
    ...webpackConfig.module,
    rules: getRules(webpackConfig),
  };
}

function getRules({ module }: webpack.Configuration) {
  const existingRules = (module && module.rules) || [];
  return [...existingRules, getUserDepsLoaderRule()];
}

function getUserDepsLoaderRule(): webpack.RuleSetRule {
  return {
    loader: resolveWebpackLoaderPath(),
    include: resolveWebpackClientPath('userDeps'),
  };
}
