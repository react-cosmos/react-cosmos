// @flow

import { join } from 'path';
import { readFileSync } from 'fs';
import { replaceKeys } from './template';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';

export function getPlaygroundHtml(
  scriptSrc: string,
  playgroundOpts: PlaygroundOpts
) {
  return replaceKeys(getHtmlTemplate(), {
    __SCRIPT_SRC__: scriptSrc,
    __PLAYGROUND_OPTS__: JSON.stringify(playgroundOpts)
  });
}

export function getPlaygroundHtmlNext(scriptSrc: string) {
  return replaceKeys(getHtmlTemplate(), {
    __SCRIPT_SRC__: scriptSrc,
    __PLAYGROUND_OPTS__: JSON.stringify({})
  });
}

function getHtmlTemplate() {
  return readFileSync(join(__dirname, 'static/index.html'), 'utf8');
}
