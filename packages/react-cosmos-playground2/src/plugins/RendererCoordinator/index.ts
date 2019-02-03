import { createPlugin } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import { RouterSpec } from '../Router/public';
import { setFixtureState } from './setFixtureState';
import { receiveResponse } from './receiveResponse';
import { onRouterFixtureChange } from './onRouterFixtureChange';
import { RendererCoordinatorSpec } from './public';
import { Context } from './shared';
import { getUrlParams } from './shared/router';

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
    remoteRenderersEnabled,
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

function getWebUrl({ getConfig }: Context) {
  return getConfig().webUrl;
}

function remoteRenderersEnabled({ getConfig }: Context) {
  return getConfig().enableRemote;
}

function getConnectedRendererIds({ getState }: Context) {
  return getState().connectedRendererIds;
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

function isValidFixtureSelected(context: Context) {
  const { fixturePath } = getUrlParams(context);

  return (
    fixturePath !== undefined &&
    context.getState().fixtures.indexOf(fixturePath) !== -1
  );
}

function selectPrimaryRenderer(
  { setState }: Context,
  primaryRendererId: RendererId
) {
  setState(prevState => ({ ...prevState, primaryRendererId }));
}
