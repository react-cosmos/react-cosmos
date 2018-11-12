// @flow

import { createContext } from 'react';

import type { PlaygroundContextValue } from '../index.js.flow';

export const defaultState = {
  // TODO: Find better abstraction than "core"
  core: {
    renderers: [],
    fixtures: []
  }
};

const noopFn = () => {};
const noopSubFn = () => () => {};

export const PlaygroundContext = createContext<PlaygroundContextValue>({
  options: {
    rendererUrl: ''
  },
  state: defaultState,
  setState: noopFn,
  registerMethods: noopSubFn,
  callMethod: noopFn,
  addEventListener: noopSubFn,
  emitEvent: noopFn
});
