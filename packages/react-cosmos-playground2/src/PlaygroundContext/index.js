// @flow

import { createContext } from 'react';

import type { PlaygroundContextValue } from '../index.js.flow';

export const defaultUiState = {
  renderers: [],
  fixtures: [],
  fixturePath: null
};

export const PlaygroundContext = createContext<PlaygroundContextValue>({
  options: {
    rendererUrl: ''
  },
  uiState: defaultUiState,
  setUiState: () => {},
  fixtureState: null,
  replaceFixtureState: () => {},
  postRendererRequest: () => {},
  onRendererRequest: () => () => {},
  receiveRendererResponse: () => {},
  onRendererResponse: () => () => {}
});
