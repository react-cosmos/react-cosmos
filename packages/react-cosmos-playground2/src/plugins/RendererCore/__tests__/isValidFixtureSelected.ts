import { loadPlugins } from 'react-plugin';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { cleanup } from '../../../testHelpers/plugin';
import {
  getRendererCoreMethods,
  mockRouter,
  mockNotifications
} from '../../../testHelpers/pluginMocks';
import { mockRendererReady } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const rendererId = 'mockRendererId';
const fixtures = {
  'ein.js': ['a', 'b', 'c'],
  'zwei.js': null,
  'drei.js': null
};

function mockFixtureId(fixtureId: null | FixtureId = null) {
  mockRouter({
    getSelectedFixtureId: () => fixtureId
  });
  mockNotifications({
    pushTimedNotification: () => {}
  });
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady(rendererId, fixtures);
}

function isValidFixtureSelected() {
  return getRendererCoreMethods().isValidFixtureSelected();
}

it('returns false on no fixture selected', async () => {
  register();
  mockFixtureId();
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(false);
});

it('returns false on missing fixture', async () => {
  register();
  mockFixtureId({ path: 'sechs.js', name: null });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(false);
});

it('returns true on existing fixture', async () => {
  register();
  mockFixtureId({ path: 'drei.js', name: null });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(true);
});

it('returns false on missing named fixture', async () => {
  register();
  mockFixtureId({ path: 'ein.js', name: 'd' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(false);
});

it('returns true on existing named fixture', async () => {
  register();
  mockFixtureId({ path: 'ein.js', name: 'a' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(true);
});
