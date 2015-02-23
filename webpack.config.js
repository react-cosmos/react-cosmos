module.exports = {
  entry: './cosmos.js',
  output: {
    // TODO: Rename once gulp builds are deleted
    filename: './build/cosmos.webpack.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader'
    }]
  }
};
