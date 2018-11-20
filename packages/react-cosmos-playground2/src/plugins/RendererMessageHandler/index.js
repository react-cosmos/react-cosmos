// @flow

import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererMessageHandler } from './RendererMessageHandler';

export type { RendererState, RendererStates } from './shared';

registerGlobalPlugin('RendererMessageHandler', RendererMessageHandler);
