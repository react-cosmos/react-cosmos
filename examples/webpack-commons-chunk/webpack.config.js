const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos-webpack adds an entry & output when extending this.
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest'],
    }),
  ],
};
