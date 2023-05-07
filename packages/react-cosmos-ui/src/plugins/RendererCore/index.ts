import { RendererId } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { RouterSpec } from '../Router/spec.js';
import { onRouterFixtureChange } from './onRouterFixtureChange.js';
import { receiveResponse } from './receiveResponse/index.js';
import { reloadRenderer } from './reloadRenderer.js';
import { setFixtureState } from './setFixtureState.js';
import { RendererCoreContext } from './shared/index.js';
import { RendererCoreSpec } from './spec.js';

const { on, register, onLoad } = createPlugin<RendererCoreSpec>({
  name: 'rendererCore',
  defaultConfig: {
    fixtures: {},
    webRendererUrl: null,
  },
  initialState: {
    connectedRendererIds: [],
    primaryRendererId: null,
    fixtures: {},
    fixtureState: {},
  },
  methods: {
    getWebRendererUrl,
    getConnectedRendererIds,
    getPrimaryRendererId,
    getFixtures,
    getFixtureState,
    isRendererConnected,
    reloadRenderer,
    setFixtureState,
    selectPrimaryRenderer,
    receiveResponse,
  },
});

onLoad(({ getConfig, setState }) => {
  const { fixtures } = getConfig();
  setState(prevState => ({ ...prevState, fixtures }));
});

on<RouterSpec>('router', { fixtureChange: onRouterFixtureChange });

export { register };

if (process.env.NODE_ENV !== 'test') register();

function getWebRendererUrl({ getConfig }: RendererCoreContext) {
  return getConfig().webRendererUrl;
}

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
