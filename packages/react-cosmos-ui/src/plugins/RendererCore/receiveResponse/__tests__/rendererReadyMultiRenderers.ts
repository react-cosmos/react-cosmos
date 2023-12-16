import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
} from '../../../../testHelpers/pluginMocks.js';
import { register } from '../../index.js';
import {
  mockFixtureStateChange,
  mockRendererReady,
} from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

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
  mockRendererReady('mockRendererId1');
  mockRendererReady('mockRendererId2');
  mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
}

it('returns connected renderer IDs', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await waitFor(() =>
    expect(getRendererCoreMethods().getConnectedRendererIds()).toEqual([
      'mockRendererId1',
      'mockRendererId2',
    ])
  );
});

it('returns primary renderer ID', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await waitFor(() =>
    expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
      'mockRendererId1'
    )
  );
});

it('returns fixture state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await waitFor(() =>
    expect(getRendererCoreMethods().getAllFixtureState()).toEqual(fixtureState)
  );
});

it('resets fixtures state when primary renderer re-connects', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockRendererReady('mockRendererId1');
  await waitFor(() =>
    expect(getRendererCoreMethods().getAllFixtureState()).toEqual({})
  );
});
