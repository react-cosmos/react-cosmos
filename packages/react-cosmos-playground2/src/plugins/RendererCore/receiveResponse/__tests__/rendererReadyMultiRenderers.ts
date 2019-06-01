import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../../../testHelpers/plugin';
import {
  getRendererCoreMethods,
  mockRouter,
  mockNotifications
} from '../../../../testHelpers/pluginMocks';
import { mockRendererReady, mockFixtureStateChange } from '../../testHelpers';
import { register } from '../..';

afterEach(cleanup);

const fixtures = { 'ein.js': null };
const fixtureId = { path: 'zwei.js', name: null };
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
  mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
}

it('returns connected renderer IDs', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await wait(() =>
    expect(getRendererCoreMethods().getConnectedRendererIds()).toEqual([
      'mockRendererId1',
      'mockRendererId2'
    ])
  );
});

it('returns primary renderer ID', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await wait(() =>
    expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
      'mockRendererId1'
    )
  );
});

it('returns fixtures', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await wait(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual(fixtures)
  );
});

it('returns fixture state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  await wait(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual(fixtureState)
  );
});

it('resets fixtures state when primary renderer re-connects', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  await wait(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual({})
  );
});
