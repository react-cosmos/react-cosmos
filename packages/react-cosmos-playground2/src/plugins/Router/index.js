// @flow

import { registerInitialPluginState } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { Router } from './Router';

import type { RouterState } from './shared';
export type { UrlParams, RouterState } from './shared';

const initialState: RouterState = {
  urlParams: {}
};

registerInitialPluginState('router', initialState);

registerGlobalPlugin('router', Router);
