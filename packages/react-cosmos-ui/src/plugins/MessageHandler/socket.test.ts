import { loadPlugins } from 'react-plugin';
import { vi } from 'vitest';
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
  vi.clearAllMocks();
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
  return vi
    .spyOn(global, 'WebSocket')
    .mockImplementation(createMockWebSocket());
}

function createMockWebSocket() {
  return () =>
    ({
      addEventListener: vi.fn(),
      close: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as WebSocket;
}
