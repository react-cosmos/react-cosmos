import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default function (webpackConfig, env) {
  // Customize webpack config for Cosmos...
  console.log('Overriding webpack config for Cosmos!');
  console.log('Environment:', env);

  if (env === 'development') {
    webpackConfig.module.rules[0].use.options.plugins = ['react-refresh/babel'];
    // overlay: false — Cosmos already has its own error overlay via
    // react-error-overlay, and the plugin's default sock integration pulls
    // in webpack-dev-server, which Cosmos doesn't use.
    webpackConfig.plugins.push(
      new ReactRefreshWebpackPlugin({ overlay: false })
    );
  }

  return webpackConfig;
}
