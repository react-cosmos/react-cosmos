const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

const src = path.join(__dirname, 'src');
const lib = path.join(__dirname, 'lib');
const nodeModules = path.join(__dirname, 'node_modules');

module.exports = {
  entry: src,
  output: {
    libraryTarget: 'umd',
    library: 'ReactComponentPlayground',
    path: lib,
    filename: 'index.js',
  },
  externals: {
    // No need to bundle JS deps in the lib. They'll be downloaded & bundled
    // on the consumer side. The purpose of this bundle is to embed the styles
    // not require users to add CSS & LESS webpack loaders to their build.
    classnames: 'classnames',
    codemirror: 'codemirror',
    'codemirror/mode/javascript/javascript': 'codemirror/mode/javascript/javascript',
    'codemirror/addon/fold/foldcode': 'codemirror/addon/fold/foldcode',
    'codemirror/addon/fold/foldgutter': 'codemirror/addon/fold/foldgutter',
    'codemirror/addon/fold/brace-fold': 'codemirror/addon/fold/brace-fold',
    'fuzzaldrin-plus': 'fuzzaldrin-plus',
    lodash: 'lodash',
    '@skidding/react-codemirror': '@skidding/react-codemirror',
    'react-component-tree': 'react-component-tree',
    'react-dom-polyfill': 'react-dom-polyfill',
    'react-querystring-router': 'react-querystring-router',
    'ubervu-react-split-pane': 'ubervu-react-split-pane',
    react: 'react',
    'react-dom': 'react-dom',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      include: src,
      use: 'babel-loader',
    }, {
      test: /\.(css|less)$/,
      include: src,
      use: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'less-loader',
      ],
    }, {
      test: /\.css$/,
      include: nodeModules,
      use: [
        'style-loader',
        'css-loader',
      ],
    }, {
      test: /\.png$/,
      include: src,
      use: 'url-loader'
    }],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      mangle: false,
      beautify: true,
    }),
  ],
};
