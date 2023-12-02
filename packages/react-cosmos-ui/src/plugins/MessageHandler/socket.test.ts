import { loadPlugins } from 'react-plugin';
import { mockCore } from '../../testHelpers/pluginMocks.js';
import { register } from './index.js';

const originalWindowLocation = window.location;

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    value: {
      origin: 'http://example.com',
    },
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    value: originalWindowLocation,
  });
});

beforeEach(() => {
  register();
  mockCore({
    isDevServerOn: () => true,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

it('initializes a websocket using "ws" protocol when not on HTTPS', () => {
  mockLocation('http://example.com');
  const webSocketMock = mockWebSocket();

  loadPlugins();
  expect(webSocketMock).toHaveBeenCalledWith('ws://example.com');
});

it('initializes a websocket using "wss" protocol when on HTTPS', () => {
  mockLocation('https://example.com');
  const webSocketMock = mockWebSocket();

  loadPlugins();
  expect(webSocketMock).toHaveBeenCalledWith('wss://example.com');
});

function mockLocation(url: string) {
  Object.defineProperty(window.location, 'origin', { value: url });
}

function mockWebSocket() {
  return jest
    .spyOn(global, 'WebSocket')
    .mockImplementation(createMockWebSocket());
}

function createMockWebSocket() {
  return () =>
    ({
      addEventListener: jest.fn(),
      close: jest.fn(),
      removeEventListener: jest.fn(),
    }) as unknown as WebSocket;
}
