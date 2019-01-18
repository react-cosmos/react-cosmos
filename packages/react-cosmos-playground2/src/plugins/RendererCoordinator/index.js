// @flow

import { registerPlugin } from 'react-plugin';
import { isRendererConnected } from './isRendererConnected';
import { isValidFixtureSelected } from './isValidFixtureSelected';
import { setFixtureState } from './setFixtureState';
import { selectPrimaryRenderer } from './selectPrimaryRenderer';
import { receiveResponse } from './receiveResponse';
import { onRouterFixtureChange } from './onRouterFixtureChange';

import type { RendererCoordinatorConfig } from '../../index.js.flow';
import type { RendererCoordinatorState } from './shared';

export type { RendererCoordinatorConfig } from '../../index.js.flow';
export type { RendererCoordinatorState } from './shared';

export function register() {
  const { on, method } = registerPlugin<
    RendererCoordinatorConfig,
    RendererCoordinatorState
  >({
    // "coordinator: someone whose task is to see that work goes harmoniously"
    name: 'rendererCoordinator',
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
