// @flow

import { registerInitialPluginState } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { Router } from './Router';
import { getUrlParamsFromLocation } from './window';

import type { RouterState } from './shared';
export type { UrlParams, RouterState } from './shared';

registerInitialPluginState(
  'router',
  (): RouterState => ({
    urlParams: getUrlParamsFromLocation()
  })
);

registerGlobalPlugin('router', Router);
