// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { mockWebSockets } from '../../testHelpers/mockWebSockets';
import { cleanup, mockMethod, mockInitEmit } from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

it('posts renderer request message via websockets', async () => {
  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'bar-fixturePath'
    }
  };

  loadTestPlugins(() => {
    mockMethod('renderer.postRequest', () => {});
    mockInitEmit('renderer.request', selectFixtureMsg);
  });

  await mockWebSockets(async ({ onMessage }) => {
    await wait(() => expect(onMessage).toBeCalledWith(selectFixtureMsg));
  });
});

it('broadcasts renderer response message from websocket event', async () => {
  const fixtureListMsg = {
    type: 'fixtureList',
    payload: {
      rendererId: 'foo-renderer',
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };
  const handleReceiveResponse = jest.fn();

  loadTestPlugins(() => {
    mockMethod('renderer.postRequest', () => {});
    mockMethod('renderer.receiveResponse', handleReceiveResponse);
  });

  await mockWebSockets(async ({ postMessage }) => {
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
  const handlePostRequest = jest.fn();

  loadTestPlugins(() => {
    mockMethod('renderer.postRequest', handlePostRequest);
  });

  await wait(() =>
    expect(handlePostRequest).toBeCalledWith(expect.any(Object), {
      type: 'requestFixtureList'
    })
  );
});

function loadTestPlugins(extraSetup = () => {}) {
  register();
  extraSetup();
  loadPlugins({ config: { renderer: { enableRemote: true } } });
}
