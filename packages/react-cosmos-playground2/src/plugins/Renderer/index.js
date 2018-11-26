// @flow

import {
  registerDefaultPluginConfig,
  registerInitialPluginState
} from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { Renderer } from './Renderer';

import type { RendererState } from './shared';
export type { RendererItemState, RendererState } from './shared';

registerDefaultPluginConfig('renderer', {
  webUrl: null,
  enableRemoteConnect: false
});

registerInitialPluginState(
  'renderer',
  (): RendererState => ({
    primaryRendererId: null,
    renderers: {}
  })
);

registerGlobalPlugin('renderer', Renderer);
