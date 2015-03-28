module.exports = {
  entry: './entry.js',
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }]
  }
};
