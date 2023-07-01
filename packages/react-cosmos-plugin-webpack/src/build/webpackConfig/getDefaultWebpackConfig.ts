import webpack from 'webpack';
import { resolveFromSilent } from '../utils/resolveSilent.js';
import { RENDERER_FILENAME } from './constants.js';
import { getWebpackNodeEnv } from './getWebpackNodeEnv.js';
import { getHtmlWebpackPlugin } from './htmlPlugin.js';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. An entry & output will be added to this base config.
export function getDefaultWebpackConfig(
  userWebpack: typeof webpack,
  rootDir: string
): webpack.Configuration {
  // react-cosmos doesn't directly depend on any webpack loader.
  // Instead, it includes the ones already installed by the user.
  const tsLoaderPath = resolveFromSilent(rootDir, 'ts-loader');
  const babelLoaderPath =
    resolveFromSilent(rootDir, 'next/dist/compiled/babel-loader') ||
    resolveFromSilent(rootDir, 'babel-loader');
  const styleLoaderPath = resolveFromSilent(rootDir, 'style-loader');
  const cssLoaderPath = resolveFromSilent(rootDir, 'css-loader');
  const postcssLoaderPath = resolveFromSilent(rootDir, 'postcss-loader');
  // Note: Since webpack >= v2.0.0, importing of JSON files will work by default
  const jsonLoaderPath = resolveFromSilent(rootDir, 'json-loader');
  const mdxLoaderPath = resolveFromSilent(rootDir, '@mdx-js/loader');

  const rules: webpack.RuleSetRule[] = [];
  const plugins: webpack.WebpackPluginInstance[] = [];

  // Prefer babel-loader over ts-loader if user has both installed. If user
  // has babel-loader installed then most likely they won't want ts-loader
  // to handle module transformation.
  if (babelLoaderPath) {
    rules.push({
      test: /\.(js|ts)x?$/,
      exclude: /node_modules/,
      use: {
        loader: babelLoaderPath,
        options: {
          root: rootDir,
        },
      },
    });
  } else if (tsLoaderPath) {
    rules.push({
      test: /\.tsx?$/,
      loader: tsLoaderPath,
    });
  }

  if (styleLoaderPath && cssLoaderPath) {
    if (postcssLoaderPath) {
      rules.push({
        test: /\.css$/,
        use: [
          styleLoaderPath,
          { loader: cssLoaderPath, options: { importLoaders: 1 } },
          postcssLoaderPath,
        ],
        exclude: /node_modules/,
      });
    } else {
      rules.push({
        test: /\.css$/,
        use: [{ loader: styleLoaderPath }, { loader: cssLoaderPath }],
        exclude: /node_modules/,
      });
    }

    // Preprocess 3rd party .css files located in node_modules
    rules.push({
      test: /\.css$/,
      use: [{ loader: styleLoaderPath }, { loader: cssLoaderPath }],
      include: /node_modules/,
    });
  }

  if (jsonLoaderPath) {
    rules.push({
      test: /\.json$/,
      loader: jsonLoaderPath,
      exclude: /node_modules/,
    });
  }

  if (mdxLoaderPath) {
    rules.push({
      test: /\.mdx$/,
      loader: mdxLoaderPath,
      exclude: /node_modules/,
    });
  }

  const htmlWebpackPlugin = getHtmlWebpackPlugin(rootDir);
  if (htmlWebpackPlugin) {
    plugins.push(
      new htmlWebpackPlugin({
        title: 'React Cosmos',
        filename: RENDERER_FILENAME,
      })
    );
  }

  const config: webpack.Configuration = {
    // Besides other advantages, cheap-module-source-map is compatible with
    // React.componentDidCatch https://github.com/facebook/react/issues/10441
    devtool: 'cheap-module-source-map',
    resolve: {
      extensionAlias: {
        '.js': ['.ts', '.tsx', '.js'],
      },
      // Warning: webpack 1.x expects ['', '.js', '.jsx']
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      // Note: `module.rules` only works with webpack >=2.x. For 1.x
      // compatibility a custom webpack config (with module.loaders) is required
      rules,
    },
    plugins,
    stats: 'minimal',
    infrastructureLogging: { level: 'warn' },
    experiments: {
      topLevelAwait: true,
    },
  };

  const webpack4 =
    userWebpack.version && parseInt(userWebpack.version, 10) >= 4;
  if (!webpack4) {
    return config;
  }

  return {
    ...config,
    mode: getWebpackNodeEnv(),
    optimization: {
      // Cosmos reads component names at run-time, so it is crucial to not
      // minify even when building with production env (ie. when exporting)
      // https://github.com/react-cosmos/react-cosmos/issues/701
      minimize: false,
    },
  };
}
