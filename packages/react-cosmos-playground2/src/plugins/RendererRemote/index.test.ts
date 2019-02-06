import { wait } from 'react-testing-library';
import { loadPlugins, getPluginContext } from 'react-plugin';
import { SelectFixtureRequest } from 'react-cosmos-shared2/renderer';
import { mockWebSockets } from './testHelpers/mockWebSockets';
import { cleanup, mockMethodsOf } from '../../testHelpers/plugin';
import { RendererCoordinatorSpec } from '../RendererCoordinator/public';
import { register } from '.';

afterEach(cleanup);

it('posts renderer request message via websockets', async () => {
  register();

  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    remoteRenderersEnabled: () => true
  });

  loadPlugins();

  const selectFixtureMsg: SelectFixtureRequest = {
    type: 'selectFixture',
    payload: {
      rendererId: 'mockRendererId',
      fixturePath: 'mockFixturePath',
      fixtureState: null
    }
  };
  getPluginContext<RendererCoordinatorSpec>('rendererCoordinator').emit(
    'request',
    selectFixtureMsg
  );

  await mockWebSockets(async ({ onMessage }) => {
    await wait(() => expect(onMessage).toBeCalledWith(selectFixtureMsg));
  });
});

it('broadcasts renderer response message from websocket event', async () => {
  register();

  const receiveResponse = jest.fn();
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    remoteRenderersEnabled: () => true,
    receiveResponse
  });

  loadPlugins();

  await mockWebSockets(async ({ postMessage }) => {
    const rendererReadyMsg = {
      type: 'rendererReady',
      payload: {
        rendererId: 'mockRendererId',
        fixtures: ['ein.js', 'zwei.js', 'drei.js']
      }
    };
    postMessage(rendererReadyMsg);

    await wait(() =>
      expect(receiveResponse).toBeCalledWith(
        expect.any(Object),
        rendererReadyMsg
      )
    );
  });
});

it('posts "requestFixtureList" renderer request on mount', async () => {
  register();

  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    remoteRenderersEnabled: () => true
  });

  loadPlugins();

  await mockWebSockets(async ({ onMessage }) => {
    await wait(() =>
      expect(onMessage).toBeCalledWith({
        type: 'pingRenderers'
      })
    );
  });
});
