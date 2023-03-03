import fs from 'fs/promises';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import 'isomorphic-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import { getGitHubContributors, getGitHubStars } from './src/shared/gitHub.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));
const src = path.join(dirname, 'src');
const dist = path.join(dirname, 'dist');

const env = process.env.NODE_ENV || 'development';

export default async () => {
  const { version } = await fs
    .readFile(path.join(dirname, '../lerna.json'), 'utf8')
    .then(JSON.parse);

  const ghStars = await getGitHubStars();
  const ghContributors = await getGitHubContributors();

  const config = {
    mode: env,
    entry: [path.join(src, 'index')],
    output: {
      path: dist,
      filename: 'index.js',
    },
    resolve: {
      extensionAlias: {
        '.js': ['.ts', '.tsx', '.js'],
      },
      extensions: ['.ts', '.tsx', '.js'],
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
            configFile: path.join(dirname, 'tsconfig.build.json'),
          },
        },
        {
          test: /\.css$/,
          include: src,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        RC_VERSION: JSON.stringify(version),
        GH_STARS: JSON.stringify(ghStars),
        GH_CONTRIBUTORS: JSON.stringify(ghContributors),
      }),
    ],
    optimization: {
      minimize: false,
    },
    experiments: {
      topLevelAwait: true,
    },
  };

  if (env === 'development') {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: path.join(src, 'index.dev.html'),
      })
    );
  }

  return config;
};
