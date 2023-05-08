import { waitFor } from '@testing-library/dom';
import { FixtureId } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../../testHelpers/pluginMocks.js';
import { register } from '../../index.js';
import { mockRendererReady } from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins(selectedFixtureId: FixtureId | null = null) {
  const { selectFixture } = mockRouter({
    getSelectedFixtureId: () => selectedFixtureId,
  });
  mockNotifications();
  const { request } = onRendererCore();
  return { selectFixture, request };
}

function loadTestPlugins() {
  loadPlugins();
}

it('selects initial fixture', async () => {
  const { selectFixture } = registerTestPlugins();

  loadTestPlugins();
  mockRendererReady('mockRendererId', { path: 'ein.js' });

  await waitFor(() =>
    expect(selectFixture).toBeCalledWith(expect.any(Object), { path: 'ein.js' })
  );
});

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

it('does not send fixture select request to renderer with other selected fixture', async () => {
  const { request } = registerTestPlugins({ path: 'ein.js' });

  loadTestPlugins();
  mockRendererReady('mockRendererId', { path: 'zwei.js' });

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
