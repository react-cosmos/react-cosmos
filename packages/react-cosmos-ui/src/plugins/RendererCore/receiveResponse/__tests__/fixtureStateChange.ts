import { waitFor } from '@testing-library/dom';
import { RendererId } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  mockCore,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../../testHelpers/pluginMocks.js';
import { register } from '../../index.js';
import {
  createFixtureStateChangeResponse,
  mockRendererReady,
} from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtureId = { path: 'zwei.js' };
const fixtureState = { props: [] };

function registerTestPlugins() {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => fixtureId,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1');
  mockRendererReady('mockRendererId2');
}

function mockFixtureStateChangeResponse(rendererId: RendererId) {
  const methods = getRendererCoreMethods();
  methods.receiveResponse(
    createFixtureStateChangeResponse(rendererId, fixtureId, fixtureState)
  );
}

it('sets fixtureState in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureStateChangeResponse('mockRendererId1');

  await waitFor(() =>
    expect(getRendererCoreMethods().getAllFixtureState()).toEqual(fixtureState)
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureStateChangeResponse('mockRendererId2');

  await waitFor(() =>
    expect(getRendererCoreMethods().getAllFixtureState()).toEqual({})
  );
});

it('posts "setFixtureState" request to secondary renderer', async () => {
  registerTestPlugins();
  const { request } = onRendererCore();

  loadTestPlugins();
  mockFixtureStateChangeResponse('mockRendererId1');

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId,
        fixtureState,
      },
    })
  );
});
