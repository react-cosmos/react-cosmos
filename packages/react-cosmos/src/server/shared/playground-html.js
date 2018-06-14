// @flow

import { join } from 'path';
import { readFileSync } from 'fs';

import type { Config } from 'react-cosmos-flow/config';
import type { PlaygroundOpts } from 'react-cosmos-flow/playground';

export function getPlaygroundHtml(
  cosmosConfig: Config,
  playgroundOpts: PlaygroundOpts
) {
  const html = readFileSync(join(__dirname, 'static/index.html'), 'utf8');

  return html.replace('__PLAYGROUND_OPTS__', JSON.stringify(playgroundOpts));
}
