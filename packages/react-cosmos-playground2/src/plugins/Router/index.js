// @flow

import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { Router } from './Router';

export type { RouterState } from './shared';

registerGlobalPlugin('Router', Router);
