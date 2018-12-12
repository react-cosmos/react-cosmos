// @flow

import { getPluginContext } from 'react-plugin';

export function getPluginState(pluginName: string) {
  return getPluginContext(pluginName).getState();
}
