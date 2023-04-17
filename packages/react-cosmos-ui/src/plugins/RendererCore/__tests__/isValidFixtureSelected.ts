import { FixtureId, FixtureList } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
} from '../../../testHelpers/pluginMocks.js';
import { mockRendererReady } from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const rendererId = 'mockRendererId';
const fixtures: FixtureList = {
  'ein.js': { type: 'multi', fixtureNames: ['a', 'b', 'c'] },
  'zwei.js': { type: 'single' },
  'drei.js': { type: 'single' },
};

function mockFixtureId(fixtureId: null | FixtureId = null) {
  mockRouter({
    getSelectedFixtureId: () => fixtureId,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady(rendererId, fixtures);
}

function isValidFixtureSelected() {
  return getRendererCoreMethods().isValidFixtureSelected();
}

it('returns false on no fixture selected', async () => {
  mockFixtureId();
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(false);
});

it('returns false on missing fixture', async () => {
  mockFixtureId({ path: 'sechs.js' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(false);
});

it('returns true on existing fixture', async () => {
  mockFixtureId({ path: 'drei.js' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(true);
});

it('returns false on missing named fixture', async () => {
  mockFixtureId({ path: 'ein.js', name: 'd' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(false);
});

it('returns true on existing named fixture', async () => {
  mockFixtureId({ path: 'ein.js', name: 'a' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(true);
});

it('returns true on existing multi fixture without name', async () => {
  mockFixtureId({ path: 'ein.js' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(true);
});
