import { waitFor } from '@testing-library/dom';
import { FixtureId } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockCore,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../../testHelpers/pluginMocks.js';
import { register } from '../../index.js';
import { mockRendererReady } from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins(selectedFixtureId: FixtureId) {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => selectedFixtureId,
  });
  mockNotifications();
  const { request } = onRendererCore();
  return { request };
}

function loadTestPlugins() {
  loadPlugins();
}

it('does not send fixture select request to renderer with same selected fixture', async () => {
  const { request } = registerTestPlugins({ path: 'ein.js' });

  loadTestPlugins();
  mockRendererReady('mockRendererId', { path: 'ein.js' });

  await waitFor(() =>
    expect(request).not.toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'ein.js' },
        fixtureState: {},
      },
    })
  );
});

it('sends fixture select request to renderer with different selected fixture', async () => {
  const { request } = registerTestPlugins({ path: 'ein.js' });

  loadTestPlugins();
  mockRendererReady('mockRendererId', { path: 'zwei.js' });

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'ein.js' },
        fixtureState: {},
      },
    })
  );
});
