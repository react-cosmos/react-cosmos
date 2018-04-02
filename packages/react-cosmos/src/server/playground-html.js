// @flow

import path from 'path';
import fs from 'fs';
import { hasUserCustomWebpackConfig } from './user-webpack-config';

import type { Config } from 'react-cosmos-flow/config';
import type { PlaygroundOpts } from 'react-cosmos-flow/playground';

export default function getPlaygroundHtml(cosmosConfig: Config) {
  const { rootPath } = cosmosConfig;

  const html = fs.readFileSync(
    path.join(__dirname, 'static/index.html'),
    'utf8'
  );
  const opts: PlaygroundOpts = {
    loaderUri: './loader/index.html',
    projectKey: rootPath,
    webpackConfigType: hasUserCustomWebpackConfig(cosmosConfig)
      ? 'custom'
      : 'default'
  };

  return html.replace('__PLAYGROUND_OPTS__', JSON.stringify(opts));
}
