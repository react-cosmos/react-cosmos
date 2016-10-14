import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. Cosmos adds an entry & output when extending this.
module.exports = {
  devtool: 'eval',
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  resolveLoader: {
    // This can be removed in a real life scenario. react-cosmos-webpack is a
    // sibling directory in this setup, whereas a regular npm module is nested
    // within the app. In the latter case, node modules installed in the host
    // app are found by react-cosmos-webpack due to Node's bubble up require
    // strategy.
    root: path.join(__dirname, '../node_modules'),
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        // We don't need to resolve paths in real life. Read comment from
        // resolveLoader.root for more info.
        presets: [
          require.resolve('babel-preset-es2015'),
          require.resolve('babel-preset-react'),
          require.resolve('babel-preset-react-hmre'),
        ],
      },
    }, {
      test: /\.(css|less)$/,
      loader: 'style!css!less',
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    }),
  ],
};
