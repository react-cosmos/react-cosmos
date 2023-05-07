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
  mockFixtureListItemUpdate,
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
}

it('updates fixture item in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureListItemUpdate('mockRendererId1', 'drei.js', {
    type: 'multi',
    fixtureNames: ['a', 'b', 'c'],
  });

  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual({
      ...fixtures,
      'drei.js': {
        type: 'multi',
        fixtureNames: ['a', 'b', 'c'],
      },
    })
  );
});
