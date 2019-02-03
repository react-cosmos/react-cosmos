import { createPlugin } from 'react-plugin';
import { RouterSpec } from '../Router/spec';
import { isRendererConnected } from './isRendererConnected';
import { isValidFixtureSelected } from './isValidFixtureSelected';
import { setFixtureState } from './setFixtureState';
import { selectPrimaryRenderer } from './selectPrimaryRenderer';
import { receiveResponse } from './receiveResponse';
import { onRouterFixtureChange } from './onRouterFixtureChange';
import { RendererCoordinatorSpec } from './spec';
import { RendererCoordinatorContext } from './shared';

const { on, register } = createPlugin<RendererCoordinatorSpec>({
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
  },
  methods: {
    getWebUrl,
    getConnectedRendererIds,
    getFixtures,
    getFixtureState,
    isRendererConnected,
    isValidFixtureSelected,
    setFixtureState,
    selectPrimaryRenderer,
    receiveResponse
  }
});

on<RouterSpec>('router', { fixtureChange: onRouterFixtureChange });

export { register };

function getWebUrl({ getConfig }: RendererCoordinatorContext) {
  return getConfig().webUrl;
}

function getConnectedRendererIds({ getState }: RendererCoordinatorContext) {
  return getState().connectedRendererIds;
}

function getFixtures({ getState }: RendererCoordinatorContext) {
  return getState().fixtures;
}

function getFixtureState({ getState }: RendererCoordinatorContext) {
  return getState().fixtureState;
}
