import * as React from 'react';
import * as io from 'socket.io-client';
import { create, act } from 'react-test-renderer';
import { WebSockets } from '..';
import {
  MountFixtureConnectArgs,
  MountFixtureCb,
  createFixtureConnectRenderCb,
  createFixtureConnectMockApi
} from './shared';

// __getMockApi is defined in mockSocketIo.js
const {
  WS_URL,
  getMessages,
  postMessage,
  resetMessages
} = (io as any).__getMockApi();

export async function mountWebSockets(
  args: MountFixtureConnectArgs,
  cb: MountFixtureCb
) {
  expect.hasAssertions();
  const renderer = create(getElement(args));
  try {
    await cb({
      renderer,
      update: newArgs =>
        act(() => {
          renderer.update(getElement(newArgs));
        }),
      ...createFixtureConnectMockApi({ getMessages, postMessage })
    });
  } finally {
    renderer.unmount();
    resetMessages();
  }
}

function getElement(args: MountFixtureConnectArgs) {
  return (
    <WebSockets url={WS_URL}>{createFixtureConnectRenderCb(args)}</WebSockets>
  );
}
