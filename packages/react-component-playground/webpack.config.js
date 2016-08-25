var path = require('path'),
    webpack = require('webpack');

var src = path.join(__dirname, 'src');
var lib = path.join(__dirname, 'lib');

module.exports = {
  entry: src,
  output: {
    libraryTarget: 'umd',
    library: 'ReactComponentPlayground',
    path: lib,
    filename: 'index.js'
  },
  externals: {
    // No need to bundle JS deps in the lib. They'll be downloaded & bundled
    // on the consumer side. The purpose of this bundle is to embed the styles
    // not require users to add CSS & LESS webpack loaders to their build.
    'classnames': 'classnames',
    'fuzzaldrin-plus': 'fuzzaldrin-plus',
    'lodash': 'lodash',
    'react-component-tree': 'react-component-tree',
    'react-dom-polyfill': 'react-dom-polyfill',
    'react-querystring-router': 'react-querystring-router',
    'react': 'react',
    'react-dom': 'react-dom'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: src,
    }, {
      test: /\.less$/,
      include: src,
      loader: 'style!css?modules&importLoaders=1' +
              '&localIdentName=[name]__[local]___[hash:base64:5]!less'
    }]
  }
};
