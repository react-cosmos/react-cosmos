import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  cleanup,
  getState,
  on,
  getMethodsOf,
  mockMethodsOf
} from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../public';
import { State } from '../shared';
import { register } from '..';

afterEach(cleanup);

const state: State = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null },
  fixtureState: { components: [] }
};
const expectedFixtureState = {
  components: [],
  viewport: { width: 640, height: 480 }
};

function mockSelectedFixture() {
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => ({ path: 'zwei.js', name: null })
  });
}

function loadTestPlugins() {
  loadPlugins({ state: { rendererCore: state } });
}

function mockSetFixtureStateCall() {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
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
    expect(getState<RendererCoreSpec>('rendererCore').fixtureState).toEqual(
      expectedFixtureState
    )
  );
});

it('posts "setFixtureState" renderer requests', async () => {
  register();
  mockSelectedFixture();

  const request = jest.fn();
  on<RendererCoreSpec>('rendererCore', { request });

  loadTestPlugins();
  mockSetFixtureStateCall();

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId1',
        fixtureId: { path: 'zwei.js', name: null },
        fixtureState: expectedFixtureState
      }
    })
  );

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId: { path: 'zwei.js', name: null },
        fixtureState: expectedFixtureState
      }
    })
  );
});
