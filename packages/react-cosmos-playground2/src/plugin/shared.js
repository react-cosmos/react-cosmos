// @flow

import type { StateUpdater } from 'react-cosmos-shared2/util';

export type Methods = { [methodName: string]: Function };

export type PluginContextValue = {
  pluginConfig: Object,
  getConfig: (configPath: string) => any,
  pluginState: Object,
  // State has to be typed manually after getting it
  getState: (pluginName: string) => any,
  setState: <T>(
    pluginName: string,
    stateChange: StateUpdater<T>,
    cb?: () => mixed
  ) => void,
  // Returns unsubscribe function
  registerMethods: Methods => () => void,
  callMethod: (methodName: string, ...args: any) => any,
  // Returns unsubscribe function
  addEventListener: (eventName: string, listener: Function) => () => void,
  emitEvent: (eventName: string, ...args: any) => void
};
