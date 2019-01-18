// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockEvent,
  mockCall
} from '../../../../testHelpers/plugin';
import { getFixtureStateChangeResponse } from '../../testHelpers';
import { register } from '../..';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RendererCoordinatorState } from '../..';

afterEach(cleanup);

const fixturePath = 'zwei.js';
const fixtureState = { components: [] };
const state: RendererCoordinatorState = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: null
};

function registerTestPlugins(handleRendererRequest = () => {}) {
  register();
  mockState('router', { urlParams: { fixturePath } });
  mockEvent('rendererCoordinator.request', handleRendererRequest);
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function mockFixtureStateChangeResponse(rendererId: RendererId) {
  mockCall(
    'rendererCoordinator.receiveResponse',
    getFixtureStateChangeResponse(rendererId, fixturePath, fixtureState)
  );
}

it('sets fixtureState in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureStateChangeResponse('mockRendererId1');

  await wait(() =>
    expect(getPluginState('rendererCoordinator').fixtureState).toEqual(
      fixtureState
    )
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureStateChangeResponse('mockRendererId2');

  await wait(() =>
    expect(getPluginState('rendererCoordinator').fixtureState).toEqual(null)
  );
});

it('posts "setFixtureState" request to secondary renderer', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins(handleRendererRequest);
  loadTestPlugins();

  mockFixtureStateChangeResponse('mockRendererId1');

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId2',
        fixturePath,
        fixtureState
      }
    })
  );
});
