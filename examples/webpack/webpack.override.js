import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default function (webpackConfig, env) {
  // Customize webpack config for Cosmos...
  console.log('Overriding webpack config for Cosmos!');
  console.log('Environment:', env);

  if (env === 'development') {
    webpackConfig.module.rules[0].use.options.plugins = ['react-refresh/babel'];
    webpackConfig.plugins.push(new ReactRefreshWebpackPlugin());
  }

  return webpackConfig;
}
