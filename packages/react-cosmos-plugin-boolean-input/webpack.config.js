const dist = new URL('./dist', import.meta.url).pathname;
const env = process.env.NODE_ENV || 'development';

const plugins = [];

export default {
  mode: env,
  devtool: false,
  entry: dist,
  output: {
    path: dist,
    filename: 'ui.js',
  },
  externals: {
    'react-dom': 'ReactDom',
    'react-plugin': 'ReactPlugin',
    react: 'React',
    'styled-components': 'StyledComponents',
  },
  plugins,
};
