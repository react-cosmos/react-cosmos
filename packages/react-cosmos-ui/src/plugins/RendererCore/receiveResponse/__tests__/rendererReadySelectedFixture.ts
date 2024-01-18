import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockCore,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../../testHelpers/pluginMocks.js';
import { register } from '../../index.js';
import {
  mockFixtureStateChange,
  mockRendererReady,
} from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtureId = { path: 'ein.js' };
const fixtureState = { props: [] };

function registerTestPlugins() {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => fixtureId,
  });
  mockNotifications();
  const { request } = onRendererCore();
  return { request };
}

function loadTestPlugins() {
  loadPlugins();
}

it('posts "selectFixture" renderer request', async () => {
  const { request } = registerTestPlugins();

  loadTestPlugins();
  mockRendererReady('mockRendererId');

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId,
        fixtureState: {},
      },
    })
  );
});

it('posts "selectFixture" renderer request with fixture state', async () => {
  const { request } = registerTestPlugins();

  loadTestPlugins();
  mockRendererReady('mockRendererId1');
  mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
  mockRendererReady('mockRendererId2');

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId,
        fixtureState,
      },
    })
  );
});
