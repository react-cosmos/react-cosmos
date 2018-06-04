const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    vendor: ['moment']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'dll.[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      path: path.join(__dirname, 'build', '[name]-manifest.json'),
      name: '[name]'
    })
  ]
};
