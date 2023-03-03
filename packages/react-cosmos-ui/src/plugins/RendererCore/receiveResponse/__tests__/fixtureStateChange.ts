import { waitFor } from '@testing-library/dom';
import { FixtureList, RendererId } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '../../index.js';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../../testHelpers/pluginMocks.js';
import {
  createFixtureStateChangeResponse,
  mockRendererReady,
} from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtures: FixtureList = {
  'ein.js': { type: 'single' },
  'zwei.js': { type: 'single' },
  'drei.js': { type: 'single' },
};
const fixtureId = { path: 'zwei.js' };
const fixtureState = { props: [] };

function registerTestPlugins() {
  mockRouter({
    getSelectedFixtureId: () => fixtureId,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  mockRendererReady('mockRendererId2', fixtures);
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
    expect(getRendererCoreMethods().getFixtureState()).toEqual(fixtureState)
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureStateChangeResponse('mockRendererId2');

  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual({})
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
