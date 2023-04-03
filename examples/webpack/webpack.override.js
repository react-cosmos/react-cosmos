import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default function getWebpackConfig(webpackConfig, env) {
  if (env !== 'development') return webpackConfig;

  return {
    ...webpackConfig,
    plugins: [...webpackConfig.plugins, new ReactRefreshWebpackPlugin()],
  };
}
