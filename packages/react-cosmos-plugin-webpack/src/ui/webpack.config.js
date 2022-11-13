const { join } = require('path');

const dist = join(__dirname, '../../dist');
const env = process.env.NODE_ENV || 'development';

const plugins = [];

module.exports = {
  mode: env,
  devtool: false,
  entry: [
    join(dist, 'ui/WebpackHmrNotification'),
    join(dist, 'ui/WebpackRendererError'),
  ],
  output: {
    path: dist,
    filename: 'ui/build.js',
  },
  externals: {
    'react-dom': 'ReactDom',
    'react-plugin': 'ReactPlugin',
    react: 'React',
  },
  plugins,
};
