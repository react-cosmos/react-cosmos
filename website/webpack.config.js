const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.join(__dirname, 'src');
const playgroundSrc = path.join(
  __dirname,
  '../packages/react-cosmos-playground2/src'
);

const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [src, playgroundSrc],
        loader: 'babel-loader'
      },
      { test: /\.css$/, include: src, loader: 'style-loader!css-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(src, 'index.html')
    })
  ]
};
