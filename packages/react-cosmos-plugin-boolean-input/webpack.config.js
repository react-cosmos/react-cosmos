import { fileURLToPath } from 'url';

const dist = fileURLToPath(new URL('./dist', import.meta.url));
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
