// @flow

import { join } from 'path';
import { readFileSync } from 'fs';
import { replaceKeys } from './template';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';

export function getPlaygroundHtml(playgroundOpts: PlaygroundOpts) {
  return replaceKeys(getHtmlTemplate(), {
    __PLAYGROUND_OPTS__: JSON.stringify(playgroundOpts)
  });
}

export function getPlaygroundHtmlNext() {
  return replaceKeys(getHtmlTemplate(), {
    __PLAYGROUND_OPTS__: JSON.stringify({})
  });
}

function getHtmlTemplate() {
  return readFileSync(join(__dirname, 'static/index.html'), 'utf8');
}
