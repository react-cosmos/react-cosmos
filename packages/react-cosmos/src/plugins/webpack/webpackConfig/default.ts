import resolveFrom from 'resolve-from';
import webpack from 'webpack';
import { RENDERER_FILENAME } from '../../../shared/playgroundHtml';
import { getNodeEnv } from './shared';
import { getHtmlWebpackPlugin } from './htmlPlugin';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. An entry & output will be added to this base config.
export function getDefaultWebpackConfig(
  userWebpack: typeof webpack,
  rootDir: string
): webpack.Configuration {
  // react-cosmos doesn't directly depend on any webpack loader.
  // Instead, it includes the ones already installed by the user.
  const tsLoaderPath = resolveFrom.silent(rootDir, 'ts-loader');
  const babelLoaderPath = resolveFrom.silent(rootDir, 'babel-loader');
  const styleLoaderPath = resolveFrom.silent(rootDir, 'style-loader');
  const cssLoaderPath = resolveFrom.silent(rootDir, 'css-loader');
  // Note: Since webpack >= v2.0.0, importing of JSON files will work by default
  const jsonLoaderPath = resolveFrom.silent(rootDir, 'json-loader');
  const rules: webpack.RuleSetRule[] = [];
  const plugins: webpack.Plugin[] = [];

  if (tsLoaderPath) {
    rules.push({
      test: /\.tsx?$/,
      loader: tsLoaderPath
    });
  }

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

  const config: webpack.Configuration = {
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

  const webpack4 =
    userWebpack.version && parseInt(userWebpack.version, 10) >= 4;
  if (!webpack4) {
    return config;
  }

  return {
    ...config,
    mode: getNodeEnv(),
    optimization: {
      // Cosmos reads component names at run-time, so it is crucial to not
      // minify even when building with production env (ie. when exporting)
      // https://github.com/react-cosmos/react-cosmos/issues/701
      minimize: false
    }
  };
}
