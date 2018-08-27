/* eslint-env browser */
// @flow

import React from 'react';
import {
  testFixtureConnect,
  getLastMessage,
  expectMessageSeq
} from '../jestHelpers/commonTests';
import { WebSockets, EVENT_NAME } from '../WebSockets';

import type { MockRemoteArgs } from '../jestHelpers/commonTests';

const mockUrl = 'ws://localhost:8080';
const handlers = {};
let messages = [];

const mockSocket = {
  on: jest.fn((evt, cb) => {
    handlers[evt] = cb;
  }),
  off: jest.fn(),
  emit: jest.fn((path, msg) => {
    if (path === EVENT_NAME) {
      messages.push(msg);
    }
  })
};

// FYI: Tried using https://github.com/thoov/mock-socket but at the time it
// didn't capture events as expected
jest.mock('socket.io-client', () =>
  jest.fn(url => {
    expect(url).toBe(mockUrl);

    return mockSocket;
  })
);

testFixtureConnect({
  mockRemoteApi,
  getRemoteApi: children => <WebSockets url={mockUrl}>{children}</WebSockets>
});

async function mockRemoteApi(children: MockRemoteArgs => Promise<mixed>) {
  function lastMessage() {
    return getLastMessage(messages);
  }

  async function messageSeq(...types) {
    return expectMessageSeq(() => messages, types);
  }

  async function postMessage(msg) {
    messages.push(msg);
    handlers[EVENT_NAME](msg);
  }

  try {
    await children({ lastMessage, messageSeq, postMessage });
  } finally {
    messages = [];
  }
}
