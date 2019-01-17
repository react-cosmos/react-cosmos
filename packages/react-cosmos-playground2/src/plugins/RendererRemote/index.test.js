// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { mockWebSockets } from './testHelpers/mockWebSockets';
import {
  cleanup,
  mockConfig,
  mockMethod,
  mockEmit
} from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockConfig('renderer', { enableRemote: true });
}

it('posts renderer request message via websockets', async () => {
  registerTestPlugins();
  loadPlugins();

  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'mockRendererId',
      fixturePath: 'mockFixturePath'
    }
  };
  mockEmit('renderer.request', selectFixtureMsg);

  await mockWebSockets(async ({ onMessage }) => {
    await wait(() => expect(onMessage).toBeCalledWith(selectFixtureMsg));
  });
});

it('broadcasts renderer response message from websocket event', async () => {
  registerTestPlugins();

  const handleReceiveResponse = jest.fn();
  mockMethod('renderer.receiveResponse', handleReceiveResponse);

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
      expect(handleReceiveResponse).toBeCalledWith(
        expect.any(Object),
        rendererReadyMsg
      )
    );
  });
});

it('posts "requestFixtureList" renderer request on mount', async () => {
  registerTestPlugins();

  loadPlugins();

  await mockWebSockets(async ({ onMessage }) => {
    await wait(() =>
      expect(onMessage).toBeCalledWith({
        type: 'pingRenderers'
      })
    );
  });
});
