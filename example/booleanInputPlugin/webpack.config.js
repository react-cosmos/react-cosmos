const { join } = require('path');

const src = join(__dirname, 'src');
const dist = join(__dirname, 'dist');
const env = process.env.NODE_ENV || 'development';

const plugins = [];

module.exports = {
  mode: env,
  devtool: false,
  entry: join(src, 'ui.tsx'),
  output: {
    path: dist,
    filename: 'ui.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: {
    'react-dom': 'ReactDom',
    'react-plugin': 'ReactPlugin',
    react: 'React',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: src,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins,
};
