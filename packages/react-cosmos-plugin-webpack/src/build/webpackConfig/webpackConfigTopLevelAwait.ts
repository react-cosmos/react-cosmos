import webpack from 'webpack';

export function ensureWebpackConfigTopLevelAwait(
  baseWebpackConfig: webpack.Configuration
): webpack.Configuration['experiments'] {
  const experiments = baseWebpackConfig.experiments || {};
  if (!experiments.topLevelAwait) {
    experiments.topLevelAwait = true;
  }

  return experiments;
}
