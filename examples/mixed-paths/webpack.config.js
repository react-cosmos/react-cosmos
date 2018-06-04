const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos adds an entry & output when extending this.
module.exports = {
  mode: 'development',
  resolve: {
    modules: [path.resolve(__dirname), 'node_modules'],
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
    })
  ]
};
