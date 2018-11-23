// @flow

import { registerInitialPluginState } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererMessageHandler } from './RendererMessageHandler';

import type { RenderersState } from './shared';
export type { RendererState, RenderersState } from './shared';

registerInitialPluginState(
  'renderers',
  (): RenderersState => ({
    primaryRendererId: null,
    renderers: {}
  })
);

registerGlobalPlugin('RendererMessageHandler', RendererMessageHandler);
