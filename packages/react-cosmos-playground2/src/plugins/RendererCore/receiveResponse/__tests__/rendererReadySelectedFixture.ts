import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { mockRendererReady, mockFixtureStateChange } from '../../testHelpers';
import {
  mockRouter,
  mockNotifications,
  onRendererCore,
} from '../../../../testHelpers/pluginMocks';

beforeEach(() => jest.isolateModules(() => require('../..')));

afterEach(resetPlugins);

const fixtureId = { path: 'ein.js', name: null };
const fixtures = { [fixtureId.path]: null };
const fixtureState = { props: [] };

function registerTestPlugins() {
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
  mockRendererReady('mockRendererId', fixtures);

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
  mockRendererReady('mockRendererId1', fixtures);
  mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
  mockRendererReady('mockRendererId2', fixtures);

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
