// @flow

import { createContext } from 'react';

import type { PlaygroundContextValue } from '../index.js.flow';

export const defaultUiState = {
  renderers: [],
  fixtures: []
};

const noopFn = () => {};
const noopSubscribe = () => () => {};

// IDEA: Create high level methods. Eg. selectFixture
export const PlaygroundContext = createContext<PlaygroundContextValue>({
  options: {
    rendererUrl: ''
  },
  urlParams: {},
  setUrlParams: noopFn,
  uiState: defaultUiState,
  setUiState: noopSubscribe,
  fixtureState: null,
  replaceFixtureState: noopFn,
  postRendererRequest: noopFn,
  onRendererRequest: noopSubscribe,
  receiveRendererResponse: noopFn,
  onRendererResponse: noopSubscribe
});
