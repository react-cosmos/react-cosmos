// @flow

import React from 'react';
import {
  getLastFixtureState,
  untilLastMessageEquals,
  postSelectFixture,
  postSetFixtureState
} from '../testHelpers/shared';
import { WebSockets, EVENT_NAME } from '../WebSockets';
import { FixtureConnect } from '..';

import type { ConnectMockApi } from './shared';

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

export async function mockConnect(children: ConnectMockApi => Promise<mixed>) {
  async function lastFixtureState() {
    return getLastFixtureState(() => messages);
  }

  async function untilMessage(msg) {
    return untilLastMessageEquals(() => messages, msg);
  }

  async function postMessage(msg) {
    messages.push(msg);
    handlers[EVENT_NAME](msg);
  }

  async function selectFixture({ rendererId, fixturePath }) {
    return postSelectFixture(postMessage, {
      rendererId,
      fixturePath
    });
  }

  async function setFixtureState({
    rendererId,
    fixturePath,
    fixtureStateChange
  }) {
    return postSetFixtureState(postMessage, {
      rendererId,
      fixturePath,
      fixtureStateChange
    });
  }

  try {
    await children({
      getElement,
      untilMessage,
      lastFixtureState,
      postMessage,
      selectFixture,
      setFixtureState
    });
  } finally {
    messages = [];
  }
}

function getElement(props) {
  return (
    <WebSockets url={mockUrl}>
      {({ subscribe, unsubscribe, postMessage }) => (
        <FixtureConnect
          {...props}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          postMessage={postMessage}
        />
      )}
    </WebSockets>
  );
}
