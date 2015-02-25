module.exports = {
  entry: './cosmos-entry.js',
  output: {
    libraryTarget: 'umd',
    library: 'Cosmos',
    // TODO: Rename once gulp builds are deleted
    filename: './build/cosmos.webpack.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader'
    }]
  },
  externals: {
    'lodash': '_',
    'react/addons': 'React'
  }
};
