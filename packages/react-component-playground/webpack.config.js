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
    'codemirror': 'codemirror',
    'fuzzaldrin-plus': 'fuzzaldrin-plus',
    'lodash': 'lodash',
    'react-codemirror': 'react-codemirror',
    'react-component-tree': 'react-component-tree',
    'react-dom-polyfill': 'react-dom-polyfill',
    'react-querystring-router': 'react-querystring-router',
    'ubervu-react-split-pane': 'ubervu-react-split-pane',
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
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  }
};
