// @flow

import * as rtl from 'react-testing-library';
import { resetPlugins, registerPlugin, getPluginContext } from 'react-plugin';

let plugins = {};
let pluginId: number = 0;

export function cleanup() {
  rtl.cleanup();
  resetPlugins();
  plugins = {};
}

export function getPluginState(pluginName: string) {
  return getPluginContext(pluginName).getState();
}

export function mockEvent(eventPath: string, handler: Function) {
  registerFreshPlugin().on(eventPath, handler);
}

export function mockMethod(methodPath: string, handler: Function) {
  const [pluginName, methodName] = methodPath.split('.');
  getNamedPlugin(pluginName).method(methodName, handler);
}

export function mockInitCall(methodPath: string, ...args: any[]): Promise<any> {
  return new Promise(resolve => {
    registerFreshPlugin().init(({ callMethod }) => {
      resolve(callMethod(methodPath, ...args));
    });
  });
}

export function mockInitEmit(eventPath: string, ...args: any[]) {
  const [pluginName, methodName] = eventPath.split('.');
  getNamedPlugin(pluginName).init(({ emitEvent }) => {
    emitEvent(methodName, ...args);
  });
}

function getNamedPlugin(name: string) {
  if (plugins[name]) {
    return plugins[name];
  }

  const plugin = registerPlugin({ name });
  plugins[name] = plugin;

  return plugin;
}

function registerFreshPlugin() {
  return registerPlugin({ name: `test${pluginId++}` });
}
