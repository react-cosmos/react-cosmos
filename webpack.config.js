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
    }]
  },
  output: {
    libraryTarget: 'umd',
    library: 'Cosmos',
    // TODO: Rename once gulp builds are deleted
    filename: './build/cosmos.webpack.js'
  }
};
