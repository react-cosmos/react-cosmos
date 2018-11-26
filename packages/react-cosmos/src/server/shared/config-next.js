// @flow

import type { PlaygroundOptions } from 'react-cosmos-playground2';

// TODO: Convert constants from this file into user config. But keep these
// values hardcoded in the beta-testing period. This simplifies development and
// promotes designing of good defaults.
// Related https://github.com/react-cosmos/react-cosmos/issues/488
export const FIXTURES_DIR = '__jsxfixtures__';

const defaultOptions = {
  fixturesDir: FIXTURES_DIR,
  renderer: {
    webUrl: null,
    enableRemoteConnect: false
  }
};

export function getPlaygroundOptions(
  options: $Shape<PlaygroundOptions>
): PlaygroundOptions {
  return {
    ...defaultOptions,
    ...options
  };
}
