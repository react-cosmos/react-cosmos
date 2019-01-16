// @flow

import { registerPlugin } from 'react-plugin';
import { handleRouterFixtureChange } from './handleRouterFixtureChange';
import { handleGetPrimaryRendererState } from './handleGetPrimaryRendererState';
import { handleIsRendererConnected } from './handleIsRendererConnected';
import { handleHasRendererErrors } from './handleHasRendererErrors';
import { handleIsValidFixtureSelected } from './handleIsValidFixtureSelected';
import { handleIsFixtureLoaded } from './handleIsFixtureLoaded';
import { handleSetFixtureState } from './handleSetFixtureState';
import { handleSelectPrimaryRenderer } from './handleSelectPrimaryRenderer';
import { handleReceiveResponse } from './handleReceiveResponse';

import type { RendererConfig } from '../../index.js.flow';
import type { RendererState } from './shared';

export type { RendererConfig } from '../../index.js.flow';
export type {
  RendererStatus,
  RendererItemState,
  RendererState
} from './shared';

export function register() {
  const { on, method } = registerPlugin<RendererConfig, RendererState>({
    name: 'renderer',
    // FIXME: Move config to rendererPreview and rendererRemote
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
  method('hasRendererErrors', handleHasRendererErrors);
  method('getPrimaryRendererState', handleGetPrimaryRendererState);
  method('isValidFixtureSelected', handleIsValidFixtureSelected);
  method('isFixtureLoaded', handleIsFixtureLoaded);
  method('setFixtureState', handleSetFixtureState);
  method('selectPrimaryRenderer', handleSelectPrimaryRenderer);
  method('receiveResponse', handleReceiveResponse);
}
