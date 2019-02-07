import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  getState,
  on,
  getMethodsOf,
  mockMethodsOf
} from '../../../../testHelpers/plugin';
import { RouterSpec } from '../../../Router/public';
import { createFixtureStateChangeResponse } from '../../testHelpers';
import { State } from '../../shared';
import { RendererCoreSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

const fixturePath = 'zwei.js';
const fixtureState = { components: [] };
const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: null
};

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({ fixturePath })
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCore: state } });
}

function mockFixtureStateChangeResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.receiveResponse(
    createFixtureStateChangeResponse(rendererId, fixturePath, fixtureState)
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
        fixturePath,
        fixtureState
      }
    })
  );
});
