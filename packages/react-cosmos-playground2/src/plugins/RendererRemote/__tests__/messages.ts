import { wait } from 'react-testing-library';
import { loadPlugins, getPluginContext } from 'react-plugin';
import {
  SelectFixtureRequest,
  RendererReadyResponse
} from 'react-cosmos-shared2/renderer';
import { mockWebSockets } from '../testHelpers/mockWebSockets';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

it('posts renderer request message via websockets', async () => {
  register();

  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    remoteRenderersEnabled: () => true
  });

  loadPlugins();

  const selectFixtureMsg: SelectFixtureRequest = {
    type: 'selectFixture',
    payload: {
      rendererId: 'mockRendererId',
      fixtureId: { path: 'mockFixturePath', name: null },
      fixtureState: null
    }
  };
  getPluginContext<RendererCoreSpec>('rendererCore').emit(
    'request',
    selectFixtureMsg
  );

  await mockWebSockets(async ({ onMessage }) => {
    await wait(() => expect(onMessage).toBeCalledWith(selectFixtureMsg));
  });
});

it('sends renderer response message from websocket event to renderer core', async () => {
  register();

  const receiveResponse = jest.fn();
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    remoteRenderersEnabled: () => true,
    receiveResponse
  });

  loadPlugins();

  await mockWebSockets(async ({ postMessage }) => {
    const rendererReadyMsg: RendererReadyResponse = {
      type: 'rendererReady',
      payload: {
        rendererId: 'mockRendererId',
        fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null }
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

  mockMethodsOf<RendererCoreSpec>('rendererCore', {
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
