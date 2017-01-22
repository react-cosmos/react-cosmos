// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos-webpack adds an entry & output when extending this.
module.exports = {
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.(css|less)$/,
      loader: 'style-loader!css-loader!less-loader',
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    }),
  ],
};
