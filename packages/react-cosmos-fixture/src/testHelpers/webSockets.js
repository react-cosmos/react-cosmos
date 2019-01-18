// @flow

import React from 'react';
// $FlowFixMe __getMockApi is defined in mockSocketIo.js
import { __getMockApi } from 'socket.io-client';
import { WebSockets } from '..';
import {
  createFixtureConnectRenderCallback,
  createConnectMock
} from './shared';

const { WS_URL, getMessages, postMessage, resetMessages } = __getMockApi();

export const mockWebSockets = createConnectMock(() => {
  return {
    getElement,
    getMessages,
    postMessage,
    cleanup: resetMessages
  };
});

function getElement(userProps) {
  return (
    <WebSockets url={WS_URL}>
      {createFixtureConnectRenderCallback(userProps)}
    </WebSockets>
  );
}
