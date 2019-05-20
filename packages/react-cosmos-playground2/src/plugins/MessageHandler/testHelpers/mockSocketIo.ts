type AnyFn = (...args: any[]) => any;

let handlers: { [evt: string]: AnyFn } = {};
function fakeEvent(evt: string, msg: {}) {
  handlers[evt](msg);
}

const emit = jest.fn();
const mockSocket = {
  on: (evt: string, cb: AnyFn) => {
    handlers = { ...handlers, [evt]: cb };
  },
  off: () => {},
  emit
};

jest.mock('socket.io-client', () => jest.fn(() => mockSocket));

beforeEach(() => {
  handlers = {};
  emit.mockClear();
});

type WebSocketsMockApi = {
  emit: AnyFn;
  fakeEvent: (evt: string, msg: {}) => unknown;
};

export async function mockSocketIo(
  children: (mockApi: WebSocketsMockApi) => Promise<unknown>
) {
  try {
    await children({ emit, fakeEvent });
  } catch (err) {
    // Make errors obvious
    throw err;
  }
}
