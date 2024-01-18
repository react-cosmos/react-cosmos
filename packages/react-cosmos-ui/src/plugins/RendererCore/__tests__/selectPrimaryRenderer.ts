import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  mockCore,
  mockNotifications,
  mockRouter,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import { mockRendererReady } from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  mockCore();
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1');
  mockRendererReady('mockRendererId2');
  getRendererCoreMethods().selectPrimaryRenderer('mockRendererId2');
}

it('sets primary renderer ID in state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  await waitFor(() =>
    expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
      'mockRendererId2'
    )
  );
});
