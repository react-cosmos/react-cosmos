// @flow

import { createContext } from 'react';

import type { PlaygroundContextValue } from './index.js.flow';

export const PlaygroundContext = createContext<PlaygroundContextValue>({
  options: {
    rendererUrl: ''
  },
  uiState: {
    fixtures: [],
    fixturePath: null
  },
  setUiState: () => {},
  fixtureState: null,
  replaceFixtureState: () => {},
  postRendererRequest: () => {},
  onRendererRequest: () => () => {}
});
