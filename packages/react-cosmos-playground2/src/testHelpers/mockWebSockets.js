// @flow

import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';

let onMessage;
let handlers;

function postMessage(msg) {
  handlers[RENDERER_MESSAGE_EVENT_NAME](msg);
}

const mockSocket = {
  on: (evt, cb) => {
    handlers = {
      ...handlers,
      [evt]: cb
    };
  },
  off: () => {},
  emit: (path, msg) => {
    console.log('emit', { path, msg });
    if (path === RENDERER_MESSAGE_EVENT_NAME) {
      onMessage(msg);
    }
  }
};

jest.mock('socket.io-client', () => jest.fn(() => mockSocket));

beforeEach(() => {
  onMessage = jest.fn();
  handlers = {};
});

export async function mockWebSockets(
  children: ({ postMessage: Function, onMessage: Function }) => Promise<mixed>
) {
  try {
    await children({ postMessage, onMessage });
  } catch (err) {
    // Make errors visible
    throw err;
  }
}
