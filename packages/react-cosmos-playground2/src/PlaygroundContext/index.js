// @flow

import { createContext } from 'react';

import type { PlaygroundContextValue } from '../index.js.flow';

const noopFn = () => {};
const noopSubFn = () => () => {};

export const PlaygroundContext = createContext<PlaygroundContextValue>({
  options: {
    rendererUrl: ''
  },
  pluginState: {},
  getState: noopFn,
  setState: noopFn,
  registerMethods: noopSubFn,
  callMethod: noopFn,
  addEventListener: noopSubFn,
  emitEvent: noopFn
});
