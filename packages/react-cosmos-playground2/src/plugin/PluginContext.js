// @flow

import { createContext } from 'react';

import type { PluginContextValue } from './shared';

const noopFn = () => {};
const noopSubFn = () => () => {};

export const PluginContext = createContext<PluginContextValue>({
  pluginConfig: {},
  getConfig: noopFn,
  pluginState: {},
  getState: noopFn,
  setState: noopFn,
  registerMethods: noopSubFn,
  callMethod: noopFn,
  addEventListener: noopSubFn,
  emitEvent: noopFn
});
