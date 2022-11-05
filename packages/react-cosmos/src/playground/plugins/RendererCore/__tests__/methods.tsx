import { FixtureList } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
} from '../../../testHelpers/pluginMocks';
import { mockFixtureStateChange, mockRendererReady } from '../testHelpers';

beforeEach(register);

afterEach(resetPlugins);

const fixtures: FixtureList = {
  'ein.js': { type: 'single' },
  'zwei.js': { type: 'single' },
  'drei.js': { type: 'single' },
};
const fixtureId = { path: 'foo.js' };
const fixtureState = { props: [] };

function registerTestPlugins() {
  mockRouter({
    getSelectedFixtureId: () => fixtureId,
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  mockRendererReady('mockRendererId2', fixtures);
  getRendererCoreMethods().selectPrimaryRenderer('mockRendererId2');
  mockFixtureStateChange('mockRendererId2', fixtureId, fixtureState);
}

it('returns connected renderer IDs', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getRendererCoreMethods().getConnectedRendererIds()).toEqual([
    'mockRendererId1',
    'mockRendererId2',
  ]);
});

it('returns primary renderer ID', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
    'mockRendererId2'
  );
});

it('returns fixtures', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getRendererCoreMethods().getFixtures()).toEqual({
    'ein.js': { type: 'single' },
    'zwei.js': { type: 'single' },
    'drei.js': { type: 'single' },
  });
});

it('returns fixture state', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getRendererCoreMethods().getFixtureState()).toEqual({
    props: [],
  });
});
