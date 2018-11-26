// @flow

import {
  registerDefaultPluginConfig,
  registerInitialPluginState
} from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererCore } from './RendererCore';

import type { RenderersState } from './shared';
export type { RendererState, RenderersState } from './shared';

// TODO: Use same plugin name ("renderer") for config, state and ui
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

registerGlobalPlugin('RendererCore', RendererCore);
