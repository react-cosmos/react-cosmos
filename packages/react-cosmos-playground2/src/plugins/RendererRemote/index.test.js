// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { mockWebSockets } from '../../testHelpers/mockWebSockets';
import {
  cleanup,
  mockConfig,
  mockMethod,
  mockInitEmit
} from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockConfig('renderer', { enableRemote: true });
}

it('posts renderer request message via websockets', async () => {
  registerTestPlugins();

  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'bar-fixturePath'
    }
  };
  mockInitEmit('renderer.request', selectFixtureMsg);

  loadPlugins();

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
    const fixtureListMsg = {
      type: 'fixtureList',
      payload: {
        rendererId: 'foo-renderer',
        fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
      }
    };
    postMessage(fixtureListMsg);

    await wait(() =>
      expect(handleReceiveResponse).toBeCalledWith(
        expect.any(Object),
        fixtureListMsg
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
        type: 'requestFixtureList'
      })
    );
  });
});
