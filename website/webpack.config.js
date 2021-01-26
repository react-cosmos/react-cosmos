const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('isomorphic-fetch');
const {
  getGitHubStars,
  getGitHubContributors,
} = require('./src/shared/gitHub');

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

const env = process.env.NODE_ENV || 'development';
const { version } = require('../lerna.json');

module.exports = async () => {
  const ghStars = await getGitHubStars();
  const ghContributors = await getGitHubContributors();
  const config = {
    mode: env,
    entry: [path.join(src, 'index')],
    output: {
      path: dist,
      filename: 'index.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        { test: /\.[jt]sx?$/, include: [src], loader: 'babel-loader' },
        {
          test: /\.css$/,
          include: src,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        RC_VERSION: JSON.stringify(version),
        GH_STARS: JSON.stringify(ghStars),
        GH_CONTRIBUTORS: JSON.stringify(ghContributors),
      }),
    ],
  };

  if (env === 'development') {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: path.join(src, 'index.dev.html'),
      })
    );
  }

  return config;
};
