module.exports = {
  entry: './cosmos-entry.js',
  externals: {
    'lodash': '_',
    'react/addons': 'React'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }]
  },
  output: {
    libraryTarget: 'umd',
    library: 'Cosmos',
    filename: './build/cosmos.js'
  }
};
