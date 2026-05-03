import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default function (webpackConfig, env) {
  // Customize webpack config for Cosmos...
  console.log('Overriding webpack config for Cosmos!');
  console.log('Environment:', env);

  if (env === 'development') {
    webpackConfig.module.rules[0].use.options.plugins = ['react-refresh/babel'];
    // overlay: false — Cosmos's webpack plugin already provides its own
    // error overlay (react-error-overlay) for both build and runtime
    // errors, so enabling this plugin's overlay alongside it would be
    // redundant.
    webpackConfig.plugins.push(
      new ReactRefreshWebpackPlugin({ overlay: false })
    );
  }

  return webpackConfig;
}
