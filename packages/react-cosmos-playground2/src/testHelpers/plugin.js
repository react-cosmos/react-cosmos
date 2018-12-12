// @flow

import { registerPlugin, getPluginContext } from 'react-plugin';

let pluginId: number = 0;

export function getPluginState(pluginName: string) {
  return getPluginContext(pluginName).getState();
}

export function callOnInit(methodPath: string, ...args: any[]): Promise<any> {
  return new Promise(resolve => {
    registerFreshPlugin().init(({ callMethod }) => {
      resolve(callMethod(methodPath, ...args));
    });
  });
}

function registerFreshPlugin() {
  return registerPlugin({ name: `test${pluginId++}` });
}
