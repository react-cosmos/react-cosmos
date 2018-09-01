// @flow

import { createContext } from 'react';

import type { PlaygroundContextValue } from '../types';

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
