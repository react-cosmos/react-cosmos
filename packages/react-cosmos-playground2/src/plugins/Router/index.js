// @flow

import { registerInitialPluginState } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { Router } from './Router';
import { getUrlParamsFromLocation } from './window';

export type { UrlParams } from './shared';

registerInitialPluginState('urlParams', getUrlParamsFromLocation);

registerGlobalPlugin('router', Router);
