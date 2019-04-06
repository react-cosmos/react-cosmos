import resolveFrom from 'resolve-from';
import webpack from 'webpack';
import { RENDERER_FILENAME } from '../../shared/playground';
import { getHtmlWebpackPlugin } from './htmlWebpackPlugin';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos adds an entry & output when extending this.
export default function getDefaultWebpackConfig(
  userWebpack: typeof webpack,
  rootDir: string
) {
  // react-cosmos doesn't directly depend on any webpack loader.
  // Instead, it includes the ones already installed by the user.
  const babelLoaderPath = resolveFrom.silent(rootDir, 'babel-loader');
  const styleLoaderPath = resolveFrom.silent(rootDir, 'style-loader');
  const cssLoaderPath = resolveFrom.silent(rootDir, 'css-loader');
  // Note: Since webpack >= v2.0.0, importing of JSON files will work by default
  const jsonLoaderPath = resolveFrom.silent(rootDir, 'json-loader');
  const rules: webpack.RuleSetRule[] = [];
  const plugins: webpack.Plugin[] = [];

  if (babelLoaderPath) {
    rules.push({
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: babelLoaderPath,
        options: {
          root: rootDir
        }
      }
    });
  }

  if (styleLoaderPath && cssLoaderPath) {
    rules.push({
      test: /\.css$/,
      loader: cssLoaderPath
        ? `${styleLoaderPath}!${cssLoaderPath}`
        : styleLoaderPath,
      exclude: /node_modules/
    });

    // Preprocess 3rd party .css files located in node_modules
    rules.push({
      test: /\.css$/,
      loader: cssLoaderPath
        ? `${styleLoaderPath}!${cssLoaderPath}`
        : styleLoaderPath,
      include: /node_modules/
    });
  }

  if (jsonLoaderPath) {
    rules.push({
      test: /\.json$/,
      loader: jsonLoaderPath,
      exclude: /node_modules/
    });
  }

  const htmlWebpackPlugin = getHtmlWebpackPlugin(rootDir);
  if (htmlWebpackPlugin) {
    plugins.push(
      new htmlWebpackPlugin({
        title: 'React Cosmos',
        filename: RENDERER_FILENAME
      })
    );
  }

  let config: webpack.Configuration = {
    // Besides other advantages, cheap-module-source-map is compatible with
    // React.componentDidCatch https://github.com/facebook/react/issues/10441
    devtool: 'cheap-module-source-map',
    resolve: {
      // Warning: webpack 1.x expects ['', '.js', '.jsx']
      extensions: ['.js', '.jsx']
    },
    module: {
      // Note: `module.rules` only works with webpack >=2.x. For 1.x
      // compatibility a custom webpack config (with module.loaders) is required
      rules
    },
    plugins
  };

  const supportsMode =
    userWebpack.version && parseInt(userWebpack.version, 10) >= 4;
  if (supportsMode) {
    // Disallow non dev/prod environments, like "test" inside Jest, because
    // they are not supported by webpack
    const mode =
      process.env.NODE_ENV === 'production' ? 'production' : 'development';

    config = {
      ...config,
      mode,
      optimization: {
        // Cosmos reads component names at run-time, so it is crucial to not
        // minify even when building with production env (ie. when exporting)
        // https://github.com/react-cosmos/react-cosmos/issues/701
        minimize: false
      }
    };
  }

  return config;
}
