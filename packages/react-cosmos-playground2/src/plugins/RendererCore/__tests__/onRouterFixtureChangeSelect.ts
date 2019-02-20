import { wait } from 'react-testing-library';
import { loadPlugins, getPluginContext } from 'react-plugin';
import { cleanup, on, mockMethodsOf } from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: {},
  fixtureState: { components: [] }
};

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCore: state } });
}

function emitRouterFixtureChange() {
  getPluginContext<RouterSpec>('router').emit('fixtureChange', {
    path: 'zwei.js',
    name: null
  });
}

it('posts "selectFixture" renderer requests', async () => {
  registerTestPlugins();

  const request = jest.fn();
  on<RendererCoreSpec>('rendererCore', { request });

  loadTestPlugins();
  emitRouterFixtureChange();

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId1',
        fixtureId: { path: 'zwei.js', name: null },
        fixtureState: null
      }
    })
  );

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId: { path: 'zwei.js', name: null },
        fixtureState: null
      }
    })
  );
});
