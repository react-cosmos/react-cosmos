import { RendererId, fixtureStateByName } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { RouterSpec } from '../Router/spec.js';
import { onRouterFixtureReselect } from './onRouterFixtureReselect.js';
import { onRouterFixtureSelect } from './onRouterFixtureSelect.js';
import { onRouterFixtureUnselect } from './onRouterFixtureUnselect.js';
import { receiveResponse } from './receiveResponse/index.js';
import { reloadRenderer } from './reloadRenderer.js';
import { setFixtureState } from './setFixtureState.js';
import { setGlobalFixtureState } from './setGlobalFixtureState.js';
import { RendererCoreContext } from './shared/index.js';
import { RendererCoreSpec } from './spec.js';

const { on, register, onLoad } = createPlugin<RendererCoreSpec>({
  name: 'rendererCore',
  defaultConfig: {
    fixtures: {},
    rendererUrl: null,
  },
  initialState: {
    connectedRendererIds: [],
    primaryRendererId: null,
    fixtures: {},
    fixtureState: {},
    globalFixtureState: {},
  },
  methods: {
    getRendererUrl,
    getConnectedRendererIds,
    getPrimaryRendererId,
    getFixtures,
    isRendererConnected,
    reloadRenderer,
    selectPrimaryRenderer,
    receiveResponse,
    getAllFixtureState,
    getFixtureState,
    setFixtureState,
    setGlobalFixtureState,
  },
});

onLoad(({ getConfig, setState }) => {
  const { fixtures } = getConfig();
  setState(prevState => ({ ...prevState, fixtures }));
});

on<RouterSpec>('router', {
  fixtureSelect: onRouterFixtureSelect,
  fixtureReselect: onRouterFixtureReselect,
  fixtureUnselect: onRouterFixtureUnselect,
});

export { register };

if (process.env.NODE_ENV !== 'test') register();

function getRendererUrl({ getConfig }: RendererCoreContext) {
  return getConfig().rendererUrl;
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

function getAllFixtureState({ getState }: RendererCoreContext) {
  return getState().fixtureState;
}

function getFixtureState<T>({ getState }: RendererCoreContext, name: string) {
  return fixtureStateByName<T>(getState().fixtureState, name);
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
