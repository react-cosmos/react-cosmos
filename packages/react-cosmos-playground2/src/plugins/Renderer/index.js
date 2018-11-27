// @flow

import {
  registerDefaultPluginConfig,
  registerInitialPluginState
} from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { Renderer } from './Renderer';

import type { RendererConfig, RendererState } from './shared';
export type {
  RendererConfig,
  RendererItemState,
  RendererState
} from './shared';

const defaultConfig: RendererConfig = {
  webUrl: null,
  enableRemote: false
};

registerDefaultPluginConfig('renderer', defaultConfig);

const initialState: RendererState = {
  primaryRendererId: null,
  renderers: {}
};

registerInitialPluginState('renderer', initialState);

registerGlobalPlugin('renderer', Renderer);
