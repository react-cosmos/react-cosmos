// @flow

import {
  registerDefaultPluginConfig,
  registerInitialPluginState
} from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererMessageHandler } from './RendererMessageHandler';

import type { RenderersState } from './shared';
export type { RendererState, RenderersState } from './shared';

registerDefaultPluginConfig('renderer', {
  webUrl: null,
  enableRemoteConnect: false
});

registerInitialPluginState(
  'renderers',
  (): RenderersState => ({
    primaryRendererId: null,
    renderers: {}
  })
);

registerGlobalPlugin('RendererMessageHandler', RendererMessageHandler);
