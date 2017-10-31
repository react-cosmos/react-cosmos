// @flow

import path from 'path';
import fs from 'fs';

import type { Config } from 'react-cosmos-config/src';

export default function getPlaygroundHtml(cosmosConfig: Config) {
  const { rootPath } = cosmosConfig;

  const html = fs.readFileSync(
    path.join(__dirname, 'static/index.html'),
    'utf8'
  );
  const opts = JSON.stringify({
    loaderUri: './loader/index.html',
    projectKey: rootPath
  });

  return html.replace('__PLAYGROUND_OPTS__', opts);
}
