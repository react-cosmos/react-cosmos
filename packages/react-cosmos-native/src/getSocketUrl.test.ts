import { getSocketUrl } from './getSocketUrl.js';

jest.mock(
  'react-native',
  () => ({
    NativeModules: {
      SourceCode: {
        scriptURL:
          'http://192.168.100.65:8081/index.bundle?platform=ios&dev=true&hot=false',
      },
    },
  }),
  { virtual: true }
);

afterEach(() => {
  jest.clearAllMocks();
});

it('should create socket URL', () => {
  expect(getSocketUrl('http://localhost:5050')).toBe(
    'ws://192.168.100.65:5050'
  );
});

it('should create a secure socket URL', () => {
  expect(getSocketUrl('https://localhost:5050')).toBe(
    'wss://192.168.100.65:5050'
  );
});

it('works without a defined port', () => {
  expect(getSocketUrl('https://example.com')).toBe(
    'wss://192.168.100.65:80'
  );
});
