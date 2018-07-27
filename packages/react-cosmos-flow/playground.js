// @flow

import type { PluginConfig } from './config';

export type PlaygroundWebOpts = {
  platform: 'web',
  projectKey: string,
  loaderUri: string,
  webpackConfigType: 'default' | 'custom',
  deps: {
    [string]: boolean
  },
  plugin: PluginConfig
};

export type PlaygroundNativeOpts = {
  platform: 'native',
  projectKey: string,
  plugin: PluginConfig
};

export type PlaygroundOpts = PlaygroundWebOpts | PlaygroundNativeOpts;
