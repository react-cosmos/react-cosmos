import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default function getWebpackConfig(webpackConfig) {
  return {
    ...webpackConfig,
    plugins: [...webpackConfig.plugins, new ReactRefreshWebpackPlugin()],
  };
}
