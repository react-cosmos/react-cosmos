import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getMethodsOf,
  mockMethods
} from '../../../testHelpers/plugin2';
import { UrlParams, RouterSpec } from '../../Router/spec';
import { RendererCoordinatorSpec } from '../spec';
import { RendererCoordinatorState } from '../shared';
import { register } from '..';

afterEach(cleanup);

const rendererId = 'mockRendererId';
const state: RendererCoordinatorState = {
  connectedRendererIds: [rendererId],
  primaryRendererId: rendererId,
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: null
};

function mockUrlParams(urlParams: UrlParams) {
  mockMethods<RouterSpec>('router', {
    getUrlParams: () => urlParams,
    setUrlParams: () => undefined
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function isValidFixtureSelected() {
  return getMethodsOf<RendererCoordinatorSpec>(
    'rendererCoordinator'
  ).isValidFixtureSelected();
}

it('returns false on no fixture selected', async () => {
  register();
  mockUrlParams({});
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(false);
});

it('returns false on missing fixture', async () => {
  register();
  mockUrlParams({ fixturePath: 'sechs.js' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(false);
});

it('returns true on existing fixture', async () => {
  register();
  mockUrlParams({ fixturePath: 'drei.js' });
  loadTestPlugins();

  expect(isValidFixtureSelected()).toBe(true);
});
