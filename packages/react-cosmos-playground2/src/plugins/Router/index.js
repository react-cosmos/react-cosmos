// @flow

import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { Router } from './Router';

export type { UrlParams } from './shared';

registerGlobalPlugin('Router', Router);
