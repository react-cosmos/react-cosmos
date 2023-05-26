import { waitFor } from '@testing-library/dom';
import { FixtureList } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
} from '../../../../testHelpers/pluginMocks.js';
import { register } from '../../index.js';
import {
  mockFixtureListUpdate,
  mockRendererReady,
} from '../../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtures: FixtureList = {
  'ein.js': { type: 'single' },
  'zwei.js': { type: 'single' },
  'drei.js': { type: 'single' },
};

function registerTestPlugins() {
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1');
  mockFixtureListUpdate('mockRendererId1', fixtures);
  mockRendererReady('mockRendererId2');
  mockFixtureListUpdate('mockRendererId2', fixtures);
}

it('returns fixtures', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual(fixtures)
  );
});

it('updates fixtures in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureListUpdate('mockRendererId1', {
    ...fixtures,
    'vier.js': { type: 'single' },
  });

  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual({
      ...fixtures,
      'vier.js': { type: 'single' },
    })
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureListUpdate('mockRendererId2', {
    ...fixtures,
    'vier.js': { type: 'single' },
  });

  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual(fixtures)
  );
});
