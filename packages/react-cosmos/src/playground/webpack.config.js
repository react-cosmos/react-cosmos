import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log({ url: import.meta.url, __filename, __dirname });

const dist = join(__dirname, '../../dist/playground');

const env = process.env.NODE_ENV || 'development';
const plugins = [];

if (env === 'development') {
  // Used by Cosmos config (when loading Playground inside Playground)
  plugins.push(
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    })
  );
}

export default {
  mode: env,
  devtool: false,
  entry: dist,
  module: {
    rules: [{ test: /\.js/, resolve: { fullySpecified: false } }],
  },
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'mountPlayground',
    path: dist,
    filename: 'index.bundle.js',
  },
  plugins,
};
