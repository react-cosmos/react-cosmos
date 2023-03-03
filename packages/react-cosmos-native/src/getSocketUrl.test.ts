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

it('should create socket URL', () => {
  expect(getSocketUrl('http://localhost:5050')).toBe(
    'ws://192.168.100.65:5050'
  );
});
