// @flow

import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';

export const mockUrl = 'ws://localhost:8080';

let handlers = {};
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

export function getMessages() {
  return messages;
}

export async function postMessage(msg: Object) {
  messages.push(msg);
  await new Promise(res => {
    setTimeout(() => {
      handlers[RENDERER_MESSAGE_EVENT_NAME](msg);
      res();
    });
  });
}

export function resetMessages() {
  messages = [];
}
