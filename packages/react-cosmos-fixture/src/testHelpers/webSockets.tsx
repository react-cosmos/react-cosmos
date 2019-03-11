import * as React from 'react';
import * as io from 'socket.io-client';
import { WebSockets } from '..';
import {
  FixtureConnectUserProps,
  createFixtureConnectRenderCallback,
  createConnectMock
} from './shared';

// __getMockApi is defined in mockSocketIo.js
const {
  WS_URL,
  getMessages,
  postMessage,
  resetMessages
} = (io as any).__getMockApi();

export const mockWebSockets = createConnectMock(() => {
  return {
    getElement,
    getMessages,
    postMessage,
    cleanup: resetMessages
  };
});

function getElement(userProps: FixtureConnectUserProps) {
  return (
    <WebSockets url={WS_URL}>
      {createFixtureConnectRenderCallback(userProps)}
    </WebSockets>
  );
}
