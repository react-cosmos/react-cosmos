import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default function getWebpackConfig(webpackConfig, env) {
  if (env === 'development') {
    webpackConfig.module.rules[0].use.options.plugins = ['react-refresh/babel'];
    webpackConfig.plugins.push(new ReactRefreshWebpackPlugin());
  }

  return webpackConfig;
}
