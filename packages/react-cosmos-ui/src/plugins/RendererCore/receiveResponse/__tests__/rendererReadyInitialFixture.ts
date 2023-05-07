import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockNotifications,
  mockRouter,
} from '../../../../testHelpers/pluginMocks.js';
import { register } from '../../index.js';
import { mockRendererReady } from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  const { selectFixture } = mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockNotifications();
  return { selectFixture };
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
