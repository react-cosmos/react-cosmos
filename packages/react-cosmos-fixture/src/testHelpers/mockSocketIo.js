// @flow

import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';

const WS_URL = 'ws://localhost:8080';

let handlers = {};
let messages = [];

// FYI: Tried using https://github.com/thoov/mock-socket but at the time it
// didn't capture events as expected
jest.mock('socket.io-client', () => mockSocketIo);

function mockSocketIo(url: string) {
  expect(url).toBe(WS_URL);

  return {
    on,
    off: () => {},
    emit
  };
}

mockSocketIo.__getMockApi = () => ({
  WS_URL,
  getMessages,
  postMessage,
  resetMessages
});

function on(evt: string, cb: Function) {
  handlers[evt] = cb;
}

function emit(path: string, msg: Object) {
  if (path === RENDERER_MESSAGE_EVENT_NAME) {
    messages.push(msg);
  }
}

function getMessages() {
  return messages;
}

function postMessage(msg: Object) {
  messages.push(msg);

  // Fake async delay
  setTimeout(() => {
    handlers[RENDERER_MESSAGE_EVENT_NAME](msg);
  });
}

export function resetMessages() {
  messages = [];
}
