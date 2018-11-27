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

const initialState: RendererState = {
  primaryRendererId: null,
  renderers: {}
};

const PLUGIN_NAME = 'renderer';

registerDefaultPluginConfig(PLUGIN_NAME, defaultConfig);
registerInitialPluginState(PLUGIN_NAME, initialState);
registerGlobalPlugin(PLUGIN_NAME, Renderer);
