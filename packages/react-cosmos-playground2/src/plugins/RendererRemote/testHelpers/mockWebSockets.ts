import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';

type AnyFn = (...args: any[]) => any;

let onMessage: (msg: {}) => void = () => {};
let handlers: { [evt: string]: AnyFn } = {};

function postMessage(msg: {}) {
  handlers[RENDERER_MESSAGE_EVENT_NAME](msg);
}

const mockSocket = {
  on: (evt: string, cb: AnyFn) => {
    handlers = {
      ...handlers,
      [evt]: cb
    };
  },
  off: () => {},
  emit: (path: string, msg: {}) => {
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
  children: (args: { postMessage: AnyFn; onMessage: AnyFn }) => Promise<unknown>
) {
  try {
    await children({ postMessage, onMessage });
  } catch (err) {
    // Make errors visible
    throw err;
  }
}
