const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const src = path.join(__dirname, 'src');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  devtool: false,
  resolve: {
    // https://github.com/TypeStrong/ts-loader/issues/465#issuecomment-1227798353
    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js'],
    },
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [src],
        loader: 'ts-loader',
        options: {
          configFile: path.join(__dirname, './tsconfig.build.json'),
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
};
