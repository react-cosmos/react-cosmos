import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  getMethodsOf,
  getState,
  mockMethodsOf,
  on
} from '../../../../testHelpers/plugin';
import { RouterSpec } from '../../../Router/public';
import { createFixtureStateChangeResponse } from '../../testHelpers';
import { State } from '../../shared';
import { RendererCoreSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

const fixtureId = { path: 'zwei.js', name: null };
const fixtureState = { components: [] };
const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null },
  fixtureState: null
};

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => fixtureId
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCore: state } });
}

function mockFixtureStateChangeResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.receiveResponse(
    createFixtureStateChangeResponse(rendererId, fixtureId, fixtureState)
  );
}

function getRendererCoreState() {
  return getState<RendererCoreSpec>('rendererCore');
}

it('sets fixtureState in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureStateChangeResponse('mockRendererId1');

  await wait(() =>
    expect(getRendererCoreState().fixtureState).toEqual(fixtureState)
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureStateChangeResponse('mockRendererId2');

  await wait(() => expect(getRendererCoreState().fixtureState).toEqual(null));
});

it('posts "setFixtureState" request to secondary renderer', async () => {
  registerTestPlugins();

  const request = jest.fn();
  on<RendererCoreSpec>('rendererCore', { request });

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
