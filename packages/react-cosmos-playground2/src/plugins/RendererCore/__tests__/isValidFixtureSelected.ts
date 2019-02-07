import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getMethodsOf,
  mockMethodsOf
} from '../../../testHelpers/plugin';
import { UrlParams, RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

const rendererId = 'mockRendererId';
const state: State = {
  connectedRendererIds: [rendererId],
  primaryRendererId: rendererId,
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: null
};

function mockUrlParams(urlParams: UrlParams) {
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => urlParams
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
