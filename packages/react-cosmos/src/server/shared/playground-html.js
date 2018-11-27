// @flow

import { join } from 'path';
import { readFileSync } from 'fs';
import { replaceKeys } from 'react-cosmos-shared2/util';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';
import type { PlaygroundConfig } from 'react-cosmos-playground2';

export function getPlaygroundHtml(playgroundOpts: PlaygroundOpts) {
  return replaceKeys(getHtmlTemplate(), {
    __PLAYGROUND_OPTS__: JSON.stringify(playgroundOpts)
  });
}

export function getPlaygroundHtmlNext(config: PlaygroundConfig) {
  return replaceKeys(getHtmlTemplate(), {
    __PLAYGROUND_OPTS__: JSON.stringify(config)
  });
}

function getHtmlTemplate() {
  return readFileSync(join(__dirname, 'static/index.html'), 'utf8');
}
