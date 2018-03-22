const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos adds an entry & output when extending this.
module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Cosmos'
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve('./build/dll.vendor'),
      includeSourcemap: false
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./build/vendor-manifest.json'),
      extensions: ['.js']
    })
  ]
};
