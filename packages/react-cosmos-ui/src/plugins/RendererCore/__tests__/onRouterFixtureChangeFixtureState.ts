import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getRendererCoreMethods,
  getRouterContext,
  mockNotifications,
  mockRouter,
} from '../../../testHelpers/pluginMocks.js';
import {
  mockFixtureStateChange,
  mockRendererReady,
} from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtureId = { path: 'zwei.js' };

function registerTestPlugins() {
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

function emitRouterFixtureChange(resetFixtureState: boolean) {
  getRouterContext().emit('fixtureChange', fixtureId, resetFixtureState);
}

function getFixtureState() {
  return getRendererCoreMethods().getFixtureState();
}

it('resets fixture state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  emitRouterFixtureChange(true);
  await waitFor(() => expect(getFixtureState()).toEqual({}));
});

it('does not reset fixture state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  emitRouterFixtureChange(false);
  await waitFor(() => expect(getFixtureState()).toEqual({ props: [] }));
});
