import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = fileURLToPath(new URL('.', import.meta.url));
const src = path.join(dirname, 'src');

const env = process.env.NODE_ENV || 'development';

export default {
  mode: env,
  devtool: false,
  resolve: {
    // https://github.com/TypeStrong/ts-loader/issues/465#issuecomment-1227798353
    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js'],
    },
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.[jt]sx?$/,
        include: [src],
        loader: 'ts-loader',
        options: {
          configFile: path.join(dirname, './tsconfig.build.json'),
          compilerOptions: {
            noUnusedLocals: false,
          },
        },
        // Allow react-plugin to work inside "inception" fixture
        sideEffects: true,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    }),
  ],
};
