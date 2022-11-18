import { createRequire } from 'node:module';
import webpack from 'webpack';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';

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
  const require = createRequire(import.meta.url);
  return {
    loader: require.resolve('./userDepsLoader.cjs'),
    include: resolveWebpackClientPath('userDeps'),
  };
}
