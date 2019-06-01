import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import { cleanup } from '../../../../testHelpers/plugin';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
  onRendererCore
} from '../../../../testHelpers/pluginMocks';
import {
  createFixtureStateChangeResponse,
  mockRendererReady
} from '../../testHelpers';
import { register } from '../..';

afterEach(cleanup);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };
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
}

function mockFixtureStateChangeResponse(rendererId: RendererId) {
  const methods = getRendererCoreMethods();
  methods.receiveResponse(
    createFixtureStateChangeResponse(rendererId, fixtureId, fixtureState)
  );
}

it('sets fixtureState in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureStateChangeResponse('mockRendererId1');

  await wait(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual(fixtureState)
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureStateChangeResponse('mockRendererId2');

  await wait(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual({})
  );
});

it('posts "setFixtureState" request to secondary renderer', async () => {
  registerTestPlugins();
  const { request } = onRendererCore();

  loadTestPlugins();
  mockFixtureStateChangeResponse('mockRendererId1');

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId,
        fixtureState
      }
    })
  );
});
