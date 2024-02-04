import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  getRouterContext,
  mockCore,
  mockNotifications,
  mockRouter,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import {
  mockFixtureStateChange,
  mockRendererReady,
} from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtureId = { path: 'zwei.js' };

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
  mockFixtureStateChange('mockRendererId1', fixtureId, { props: [] });
}

function emitRouterFixtureSelect() {
  getRouterContext().emit('fixtureSelect', fixtureId);
}

function emitRouterFixtureReselect() {
  getRouterContext().emit('fixtureReselect', fixtureId);
}

function getFixtureState() {
  return getRendererCoreMethods().getAllFixtureState();
}

it('resets fixture state on select', async () => {
  registerTestPlugins();
  loadTestPlugins();

  emitRouterFixtureSelect();
  await waitFor(() => expect(getFixtureState()).toEqual({}));
});

it('does not reset fixture state on reselect', async () => {
  registerTestPlugins();
  loadTestPlugins();

  emitRouterFixtureReselect();
  await waitFor(() => expect(getFixtureState()).toEqual({ props: [] }));
});
