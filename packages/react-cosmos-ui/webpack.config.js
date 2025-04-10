import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import lernaConfig from '../../lerna.json' with { type: 'json' };

const dirname = fileURLToPath(new URL('.', import.meta.url));
const src = path.join(dirname, 'src');
const dist = path.join(dirname, 'dist');

const env = process.env.NODE_ENV || 'development';

export default {
  mode: env,
  devtool: 'source-map',
  entry: path.join(src, 'playground.tsx'),
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
      },
    ],
  },
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'mountPlayground',
    path: dist,
    filename: 'playground.bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(lernaConfig.version),
    }),
  ],
};
