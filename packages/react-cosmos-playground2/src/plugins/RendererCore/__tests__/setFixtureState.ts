import { NotificationsSpec } from './../../Notifications/public';
import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  cleanup,
  on,
  getMethodsOf,
  mockMethodsOf
} from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import {
  mockRendererReady,
  getRendererCoreMethods,
  mockFixtureStateChange
} from '../testHelpers';
import { RendererCoreSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };
const fixtureId = { path: 'zwei.js', name: null };
const fixtureState = { components: [] };
const expectedFixtureState = {
  components: [],
  viewport: { width: 640, height: 480 }
};

function registerTestPlugins() {
  register();
  mockSelectedFixture();
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification: () => {}
  });
}

function mockSelectedFixture() {
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => ({ path: 'zwei.js', name: null })
  });
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId2', fixtures);
  mockRendererReady('mockRendererId1', fixtures);
  mockFixtureStateChange('mockRendererId2', fixtureId, fixtureState);
}

function mockSetFixtureStateCall() {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.setFixtureState((prevState: FixtureState) => ({
    ...prevState,
    components: prevState ? prevState.components : [],
    viewport: { width: 640, height: 480 }
  }));
}

it('sets fixture state in plugin state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockSetFixtureStateCall();

  await wait(() =>
    expect(getRendererCoreMethods().getFixtureState()).toEqual(
      expectedFixtureState
    )
  );
});

it('posts "setFixtureState" renderer requests', async () => {
  registerTestPlugins();

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
