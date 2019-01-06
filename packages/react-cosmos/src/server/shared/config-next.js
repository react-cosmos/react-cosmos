// @flow

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';
import type { PlaygroundConfig } from 'react-cosmos-playground2';

// TODO: Convert constants from this file into user config. But keep these
// values hardcoded in the beta-testing period. This simplifies development and
// promotes designing of good defaults.
// Related https://github.com/react-cosmos/react-cosmos/issues/488
export const FIXTURES_DIR = '__jsxfixtures__';
export const FIXTURE_FILE_SUFFIX = 'jsxfixture';

export function getPlaygroundConfig({
  playgroundOpts,
  enableRemoteRenderers
}: {
  playgroundOpts: PlaygroundOpts,
  enableRemoteRenderers: boolean
}): PlaygroundConfig {
  return {
    core: {
      projectId: playgroundOpts.projectKey,
      fixturesDir: FIXTURES_DIR,
      fixtureFileSuffix: FIXTURE_FILE_SUFFIX
    },
    renderer: {
      webUrl:
        playgroundOpts.platform === 'web' ? playgroundOpts.loaderUri : null,
      enableRemote: enableRemoteRenderers
    }
  };
}
