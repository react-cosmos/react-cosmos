// @flow

import { registerPlugin } from 'react-plugin';
import { handleRouterFixtureChange } from './handleRouterFixtureChange';
import { handleGetPrimaryRendererState } from './handleGetPrimaryRendererState';
import { handleIsRendererConnected } from './handleIsRendererConnected';
import { handleIsRendererBroken } from './handleIsRendererBroken';
import { handleIsValidFixtureSelected } from './handleIsValidFixtureSelected';
import { handleIsFixtureLoaded } from './handleIsFixtureLoaded';
import { handleSetFixtureState } from './handleSetFixtureState';
import { handleSelectPrimaryRenderer } from './handleSelectPrimaryRenderer';
import { handleReceiveResponse } from './handleReceiveResponse';

import type { RendererConfig } from '../../index.js.flow';
import type { RendererState } from './shared';

export type { RendererConfig } from '../../index.js.flow';
export type { RendererItemState, RendererState } from './shared';

export function register() {
  const { on, method } = registerPlugin<RendererConfig, RendererState>({
    name: 'renderer',
    defaultConfig: {
      webUrl: null,
      enableRemote: false
    },
    initialState: {
      primaryRendererId: null,
      renderers: {}
    }
  });

  on('router.fixtureChange', handleRouterFixtureChange);

  method('isRendererConnected', handleIsRendererConnected);
  method('isRendererBroken', handleIsRendererBroken);
  method('getPrimaryRendererState', handleGetPrimaryRendererState);
  method('isValidFixtureSelected', handleIsValidFixtureSelected);
  method('isFixtureLoaded', handleIsFixtureLoaded);
  method('setFixtureState', handleSetFixtureState);
  method('selectPrimaryRenderer', handleSelectPrimaryRenderer);
  method('receiveResponse', handleReceiveResponse);
}
