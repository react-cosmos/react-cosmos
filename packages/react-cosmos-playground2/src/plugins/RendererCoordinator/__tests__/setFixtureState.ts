import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  cleanup,
  getState,
  on,
  getMethodsOf,
  mockMethods
} from '../../../testHelpers/plugin2';
import { RouterSpec } from '../../Router/public';
import { RendererCoordinatorSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: { components: [] }
};
const expectedFixtureState = {
  components: [],
  viewport: { width: 640, height: 480 }
};

function mockSelectedFixture() {
  mockMethods<RouterSpec>('router', {
    getUrlParams: () => ({ fixturePath: 'zwei.js' })
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function mockSetFixtureStateCall() {
  const methods = getMethodsOf<RendererCoordinatorSpec>('rendererCoordinator');
  methods.setFixtureState((prevState: null | FixtureState) => ({
    ...prevState,
    components: prevState ? prevState.components : [],
    viewport: { width: 640, height: 480 }
  }));
}

it('sets fixture state in plugin state', async () => {
  register();
  mockSelectedFixture();

  loadTestPlugins();
  mockSetFixtureStateCall();

  await wait(() =>
    expect(
      getState<RendererCoordinatorSpec>('rendererCoordinator').fixtureState
    ).toEqual(expectedFixtureState)
  );
});

it('posts "setFixtureState" renderer requests', async () => {
  register();
  mockSelectedFixture();

  const request = jest.fn();
  on<RendererCoordinatorSpec>('rendererCoordinator', { request });

  loadTestPlugins();
  mockSetFixtureStateCall();

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId1',
        fixturePath: 'zwei.js',
        fixtureState: expectedFixtureState
      }
    })
  );

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId2',
        fixturePath: 'zwei.js',
        fixtureState: expectedFixtureState
      }
    })
  );
});
