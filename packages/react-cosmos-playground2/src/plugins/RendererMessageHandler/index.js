// @flow

import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererMessageHandler } from './RendererMessageHandler';

export type { RendererState, RenderersState } from './shared';

registerGlobalPlugin('RendererMessageHandler', RendererMessageHandler);
