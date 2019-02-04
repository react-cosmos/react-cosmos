import { wait } from 'react-testing-library';
import { loadPlugins, getPluginContext } from 'react-plugin';
import { cleanup, on, mockMethodsOf } from '../../../testHelpers/plugin2';
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
  getPluginContext<RouterSpec>('router').emit('fixtureChange', 'zwei.js');
}

it('posts "selectFixture" renderer requests', async () => {
  registerTestPlugins();

  const request = jest.fn();
  on<RendererCoordinatorSpec>('rendererCoordinator', { request });

  loadTestPlugins();
  emitRouterFixtureChange();

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId1',
        fixturePath: 'zwei.js',
        fixtureState: null
      }
    })
  );

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixturePath: 'zwei.js',
        fixtureState: null
      }
    })
  );
});
