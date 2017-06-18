const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.join(__dirname, 'src');
const lib = path.join(__dirname, 'lib');
const nodeModules = path.join(__dirname, 'node_modules');

const env = process.env.NODE_ENV;
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(env),
    },
  }),
];

if (env === 'production') {
  // Used when creating build
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      mangle: false,
      beautify: true,
    })
  );
} else {
  // Used by Cosmos config (when loading Playground inside Playground)
  plugins.push(
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    })
  );
}

module.exports = {
  entry: src,
  output: {
    libraryTarget: 'umd',
    library: 'mountPlayground',
    path: lib,
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: src,
        use: 'babel-loader',
      },
      {
        test: /\.(css|less)$/,
        include: src,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'less-loader',
        ],
      },
      {
        test: /\.css$/,
        include: nodeModules,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|woff)$/,
        include: src,
        use: 'url-loader',
      },
    ],
  },
  plugins,
};
