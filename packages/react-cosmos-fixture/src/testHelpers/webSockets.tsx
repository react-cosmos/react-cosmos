import * as React from 'react';
import * as io from 'socket.io-client';
import { WebSockets } from '..';
import {
  MountFixtureConnectArgs,
  FixtureConnectTestApi,
  createFixtureConnectRenderCb,
  createFixtureConnectMockApi
} from './shared';
import { create } from 'react-test-renderer';

// __getMockApi is defined in mockSocketIo.js
const {
  WS_URL,
  getMessages,
  postMessage,
  resetMessages
} = (io as any).__getMockApi();

export async function mountWebSockets(
  args: MountFixtureConnectArgs,
  cb: (api: FixtureConnectTestApi) => void
) {
  expect.hasAssertions();
  const renderer = create(getElement(args));
  try {
    await cb({
      renderer,
      update: newArgs => renderer.update(getElement(newArgs)),
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
