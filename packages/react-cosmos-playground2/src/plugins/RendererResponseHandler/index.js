// @flow

import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererResponseHandler } from './RendererResponseHandler';

export type { RendererState } from './shared';

registerGlobalPlugin('RendererResponseHandler', RendererResponseHandler);
