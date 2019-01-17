// @flow

import { registerPlugin } from 'react-plugin';
import { isRendererConnected } from './isRendererConnected';
import { isValidFixtureSelected } from './isValidFixtureSelected';
import { setFixtureState } from './setFixtureState';
import { selectPrimaryRenderer } from './selectPrimaryRenderer';
import { receiveResponse } from './receiveResponse';
import { onRouterFixtureChange } from './onRouterFixtureChange';

import type { RendererConfig } from '../../index.js.flow';
import type { RendererCoordinatorState } from './shared';

export type { RendererConfig } from '../../index.js.flow';
export type { RendererCoordinatorState } from './shared';

export function register() {
  const { on, method } = registerRendererCoordinatorPlugin({
    // TODO: Rename to rendererCoordinator
    name: 'renderer',
    // FIXME: Split config between rendererPreview and rendererRemote
    defaultConfig: {
      webUrl: null,
      enableRemote: false
    },
    initialState: {
      connectedRendererIds: [],
      primaryRendererId: null,
      fixtures: [],
      fixtureState: null
    }
  });

  method('isRendererConnected', isRendererConnected);
  method('isValidFixtureSelected', isValidFixtureSelected);
  method('setFixtureState', setFixtureState);
  method('selectPrimaryRenderer', selectPrimaryRenderer);
  method('receiveResponse', receiveResponse);

  on('router.fixtureChange', onRouterFixtureChange);
}

function registerRendererCoordinatorPlugin(args) {
  return registerPlugin<RendererConfig, RendererCoordinatorState>(args);
}
