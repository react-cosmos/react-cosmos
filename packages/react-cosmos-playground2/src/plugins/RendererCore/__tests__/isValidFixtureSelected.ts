import { loadPlugins } from 'react-plugin';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  getMethodsOf,
  mockMethodsOf
} from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

const rendererId = 'mockRendererId';
const state: State = {
  connectedRendererIds: [rendererId],
  primaryRendererId: rendererId,
  fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null },
  fixtureState: null
};

function mockFixtureId(fixtureId: null | FixtureId = null) {
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => fixtureId
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCore: state } });
}

function isValidFixtureSelected() {
  return getMethodsOf<RendererCoreSpec>(
    'rendererCore'
  ).isValidFixtureSelected();
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
