// TODO: Test if a webpack import (require) is kept in the compiled file
import webpack from 'webpack';
import { CosmosConfig, getPublicPath } from '../../shared/config';

export function getWebpackPublicPath(
  cosmosConfig: CosmosConfig,
  { devServer }: webpack.Configuration
) {
  const publicPath = getPublicPath(cosmosConfig);
  if (publicPath) {
    return publicPath;
  }

  return (
    devServer &&
    typeof devServer.contentBase === 'string' &&
    devServer.contentBase
  );
}
