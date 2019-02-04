import { wait } from 'react-testing-library';
import { loadPlugins, getPluginContext } from 'react-plugin';
import {
  cleanup,
  getState,
  on,
  mockMethodsOf
} from '../../../testHelpers/plugin2';
import { RouterSpec } from '../../Router/public';
import { RendererCoordinatorSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: [],
  fixtureState: { components: [] }
};

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({})
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function emitRouterFixtureChange() {
  getPluginContext<RouterSpec>('router').emit('fixtureChange', null);
}

it('resets fixture state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  emitRouterFixtureChange();

  await wait(() =>
    expect(
      getState<RendererCoordinatorSpec>('rendererCoordinator').fixtureState
    ).toEqual(null)
  );
});

it('posts "unselectFixture" renderer requests', async () => {
  registerTestPlugins();

  const request = jest.fn();
  on<RendererCoordinatorSpec>('rendererCoordinator', { request });

  loadTestPlugins();
  emitRouterFixtureChange();

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'mockRendererId1'
      }
    })
  );

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'mockRendererId2'
      }
    })
  );
});
