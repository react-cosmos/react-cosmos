import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import {
  mockFixtureStateChange,
  mockRendererReady,
} from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtureId = { path: 'zwei.js' };
const fixtureState = { props: [] };
const expectedFixtureState = {
  props: [],
  viewport: { width: 640, height: 480 },
};

function registerTestPlugins() {
  mockSelectedFixture();
  mockNotifications();
}

function mockSelectedFixture() {
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'zwei.js' }),
  });
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId2');
  mockRendererReady('mockRendererId1');
  mockFixtureStateChange('mockRendererId2', fixtureId, fixtureState);
}

function mockSetFixtureStateCall() {
  const methods = getRendererCoreMethods();
  methods.setFixtureState('viewport', { width: 640, height: 480 });
}

it('sets fixture state in plugin state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockSetFixtureStateCall();

  await waitFor(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual(
      expectedFixtureState
    )
  );
});

it('posts "setFixtureState" renderer requests', async () => {
  registerTestPlugins();
  const { request } = onRendererCore();

  loadTestPlugins();
  mockSetFixtureStateCall();

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId1',
        fixtureId: { path: 'zwei.js' },
        fixtureState: expectedFixtureState,
      },
    })
  );

  await waitFor(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId: { path: 'zwei.js' },
        fixtureState: expectedFixtureState,
      },
    })
  );
});
