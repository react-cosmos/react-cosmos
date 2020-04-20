import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  mockRouter,
  mockNotifications,
} from '../../../../testHelpers/pluginMocks';
import { mockRendererReady, mockFixtureStateChange } from '../../testHelpers';
import { register } from '../..';

afterEach(resetPlugins);

const fixtures = { 'ein.js': null };
const fixtureId = { path: 'zwei.js', name: null };
const fixtureState = { props: [] };

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => fixtureId,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1', fixtures);
}

it('returns connected renderer IDs', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await waitFor(() =>
    expect(getRendererCoreMethods().getConnectedRendererIds()).toEqual([
      'mockRendererId1',
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

it('returns fixtures', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual(fixtures)
  );
});

it('returns empty fixture state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual({})
  );
});

it('keeps fixtures state when secondary renderer connects', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
  mockRendererReady('mockRendererId2', fixtures);

  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual(fixtureState)
  );
});
