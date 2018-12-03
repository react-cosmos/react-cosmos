// @flow

import { registerInitialPluginState } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { Router } from './Router';

import type { RouterState } from './shared';
export type { UrlParams, RouterState } from './shared';

const initialState: RouterState = {
  urlParams: {}
};

const PLUGIN_NAME = 'router';

registerInitialPluginState(PLUGIN_NAME, initialState);
registerGlobalPlugin(PLUGIN_NAME, Router);
