import { createPlugin } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import { RouterSpec } from '../Router/public';
import { isValidFixtureSelected } from './isValidFixtureSelected';
import { setFixtureState } from './setFixtureState';
import { receiveResponse } from './receiveResponse';
import { onRouterFixtureChange } from './onRouterFixtureChange';
import { RendererCoreSpec } from './public';
import { Context } from './shared';

const { on, register } = createPlugin<RendererCoreSpec>({
  name: 'rendererCore',
  defaultConfig: {
    webUrl: null,
    enableRemote: false
  },
  initialState: {
    connectedRendererIds: [],
    primaryRendererId: null,
    fixtures: {},
    fixtureState: null
  },
  methods: {
    getWebUrl,
    remoteRenderersEnabled,
    getConnectedRendererIds,
    getPrimaryRendererId,
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

function getWebUrl({ getConfig }: Context) {
  return getConfig().webUrl;
}

function remoteRenderersEnabled({ getConfig }: Context) {
  return getConfig().enableRemote;
}

function getConnectedRendererIds({ getState }: Context) {
  return getState().connectedRendererIds;
}

function getPrimaryRendererId({ getState }: Context) {
  return getState().primaryRendererId;
}

function getFixtures({ getState }: Context) {
  return getState().fixtures;
}

function getFixtureState({ getState }: Context) {
  return getState().fixtureState;
}

function isRendererConnected({ getState }: Context) {
  return getState().connectedRendererIds.length > 0;
}

function selectPrimaryRenderer(
  { setState }: Context,
  primaryRendererId: RendererId
) {
  setState(prevState => ({ ...prevState, primaryRendererId }));
}
