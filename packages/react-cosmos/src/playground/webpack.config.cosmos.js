const HtmlWebpackPlugin = require('html-webpack-plugin');
const { join } = require('path');

const src = join(__dirname, '..');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  devtool: false,
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [src],
        loader: 'ts-loader',
        options: {
          configFile: join(__dirname, '../../tsconfig.build.json'),
          compilerOptions: {
            // Make sure tsc doesn't convert modules to CommonJS because they
            // will end up depending on CJS react-cosmos-core modules instead of
            // sharing the EJS react-cosmos-core modules imported in fixtures.
            module: 'ES2022',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    }),
  ],
};
