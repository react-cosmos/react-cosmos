import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  getRendererCoreMethods,
  mockRouter,
  mockNotifications
} from '../../../testHelpers/pluginMocks';
import { mockRendererReady, mockFixtureStateChange } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };
const fixtureId = { path: 'foo.js', name: null };
const fixtureState = { props: [] };

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => fixtureId
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
    'mockRendererId2'
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
    'ein.js': null,
    'zwei.js': null,
    'drei.js': null
  });
});

it('returns fixture state', () => {
  registerTestPlugins();
  loadTestPlugins();
  expect(getRendererCoreMethods().getFixtureState()).toEqual({
    props: []
  });
});
