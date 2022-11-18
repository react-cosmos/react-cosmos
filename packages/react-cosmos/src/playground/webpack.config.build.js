const dist = new URL('../../dist/playground', import.meta.url).pathname;

const env = process.env.NODE_ENV || 'development';

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
};
