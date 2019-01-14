// @flow

import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';

export const WS_URL = 'ws://localhost:8080';

let handlers = {};
let messages = [];

// FYI: Tried using https://github.com/thoov/mock-socket but at the time it
// didn't capture events as expected
export default (url: string) => {
  expect(url).toBe(WS_URL);

  return {
    on,
    off: () => {},
    emit
  };
};

function on(evt: string, cb: Function) {
  handlers[evt] = cb;
}

function emit(path: string, msg: Object) {
  if (path === RENDERER_MESSAGE_EVENT_NAME) {
    messages.push(msg);
  }
}

export function __getMockApi() {
  return {
    WS_URL,
    getMessages,
    postMessage,
    resetMessages
  };
}

function getMessages() {
  return messages;
}

function postMessage(msg: Object): Promise<void> {
  messages.push(msg);

  // Fake async delay
  return new Promise(res => {
    setTimeout(() => {
      handlers[RENDERER_MESSAGE_EVENT_NAME](msg);
      res();
    });
  });
}

export function resetMessages() {
  messages = [];
}
