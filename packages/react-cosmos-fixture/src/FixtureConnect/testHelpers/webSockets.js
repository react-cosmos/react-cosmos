// @flow

import React from 'react';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import {
  getFixtureStateFromLastChange,
  untilLastMessageEquals,
  postSelectFixture,
  postUnselectFixture,
  postSetFixtureState
} from '../testHelpers/shared';
import { WebSockets } from '../WebSockets';
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
    if (path === RENDERER_MESSAGE_EVENT_NAME) {
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
  function getMessages() {
    return messages;
  }

  async function getFxStateFromLastChange() {
    return getFixtureStateFromLastChange(getMessages);
  }

  async function untilMessage(msg) {
    return untilLastMessageEquals(() => messages, msg);
  }

  async function postMessage(msg) {
    messages.push(msg);
    handlers[RENDERER_MESSAGE_EVENT_NAME](msg);
  }

  async function selectFixture({ rendererId, fixturePath, fixtureState }) {
    return postSelectFixture(postMessage, {
      rendererId,
      fixturePath,
      fixtureState
    });
  }

  async function unselectFixture({ rendererId }) {
    return postUnselectFixture(postMessage, {
      rendererId
    });
  }

  async function setFixtureState({ rendererId, fixturePath, fixtureState }) {
    return postSetFixtureState(postMessage, {
      rendererId,
      fixturePath,
      fixtureState
    });
  }

  try {
    await children({
      getElement,
      untilMessage,
      getFxStateFromLastChange,
      postMessage,
      selectFixture,
      unselectFixture,
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
