const { join } = require('path');

const dist = join(__dirname, 'dist');
const env = process.env.NODE_ENV || 'development';

const plugins = [];

module.exports = {
  mode: env,
  devtool: false,
  entry: join(dist, 'WebpackHmrNotification'),
  output: {
    path: dist,
    filename: 'ui.js',
  },
  externals: {
    'react-dom': 'ReactDom',
    'react-plugin': 'ReactPlugin',
    react: 'React',
  },
  plugins,
};
