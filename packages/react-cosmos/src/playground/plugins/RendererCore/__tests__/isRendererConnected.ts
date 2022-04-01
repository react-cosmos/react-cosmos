import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
} from '../../../testHelpers/pluginMocks';
import { mockRendererReady } from '../testHelpers';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function registerTestPlugins() {
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockNotifications();
}

function isRendererConnected() {
  return getRendererCoreMethods().isRendererConnected();
}

it('returns false', async () => {
  registerTestPlugins();
  loadPlugins();

  expect(isRendererConnected()).toBe(false);
});

it('returns true', async () => {
  registerTestPlugins();
  loadPlugins();
  mockRendererReady('mockRendererId', {});

  expect(isRendererConnected()).toBe(true);
});
