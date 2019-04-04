// TODO: Test if a webpack import (require) is kept in the compiled file
import webpack from 'webpack';
import { CosmosConfig } from '../../shared/config';

export function getPublicPath(
  { publicPath }: CosmosConfig,
  { devServer }: webpack.Configuration
) {
  if (publicPath) {
    return publicPath;
  }

  return (
    devServer &&
    typeof devServer.contentBase === 'string' &&
    devServer.contentBase
  );
}
