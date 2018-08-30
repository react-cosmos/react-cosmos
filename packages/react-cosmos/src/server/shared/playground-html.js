// @flow

import { join } from 'path';
import { readFileSync } from 'fs';
import { replaceKeys } from './template';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';
import type { PlaygroundOptions } from 'react-cosmos-playground2';

export function getPlaygroundHtml(playgroundOpts: PlaygroundOpts) {
  return replaceKeys(getHtmlTemplate(), {
    __PLAYGROUND_OPTS__: JSON.stringify(playgroundOpts)
  });
}

export function getPlaygroundHtmlNext(options: PlaygroundOptions) {
  return replaceKeys(getHtmlTemplate(), {
    __PLAYGROUND_OPTS__: JSON.stringify(options)
  });
}

function getHtmlTemplate() {
  return readFileSync(join(__dirname, 'static/index.html'), 'utf8');
}
