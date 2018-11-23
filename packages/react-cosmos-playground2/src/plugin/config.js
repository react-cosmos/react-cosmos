// @flow

import { merge } from 'lodash';

let defaultConfig = {};

export function registerDefaultPluginConfig(pluginKey: string, value: any) {
  defaultConfig = {
    ...defaultConfig,
    [pluginKey]: value
  };
}

export function getPluginConfig(customConfig: Object) {
  return merge({}, defaultConfig, customConfig);
}
