import { RendererId } from 'react-cosmos-shared2/renderer';
import { RendererCoreSpec, RouterSpec } from 'react-cosmos-shared2/ui';
import { createPlugin } from 'react-plugin';
import { isValidFixtureSelected } from './isValidFixtureSelected';
import { onRouterFixtureChange } from './onRouterFixtureChange';
import { receiveResponse } from './receiveResponse';
import { setFixtureState } from './setFixtureState';
import { RendererCoreContext } from './shared';

const { on, register } = createPlugin<RendererCoreSpec>({
  name: 'rendererCore',
  initialState: {
    connectedRendererIds: [],
    primaryRendererId: null,
    fixtures: {},
    fixtureState: {},
  },
  methods: {
    getConnectedRendererIds,
    getPrimaryRendererId,
    getFixtures,
    getFixtureState,
    isRendererConnected,
    isValidFixtureSelected,
    setFixtureState,
    selectPrimaryRenderer,
    receiveResponse,
  },
});

on<RouterSpec>('router', { fixtureChange: onRouterFixtureChange });

register();

function getConnectedRendererIds({ getState }: RendererCoreContext) {
  return getState().connectedRendererIds;
}

function getPrimaryRendererId({ getState }: RendererCoreContext) {
  return getState().primaryRendererId;
}

function getFixtures({ getState }: RendererCoreContext) {
  return getState().fixtures;
}

function getFixtureState({ getState }: RendererCoreContext) {
  return getState().fixtureState;
}

function isRendererConnected({ getState }: RendererCoreContext) {
  return getState().connectedRendererIds.length > 0;
}

function selectPrimaryRenderer(
  { setState }: RendererCoreContext,
  primaryRendererId: RendererId
) {
  setState(prevState => ({ ...prevState, primaryRendererId }));
}
