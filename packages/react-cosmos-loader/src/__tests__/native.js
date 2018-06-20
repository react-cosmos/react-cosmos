// @flow

import until from 'async-until';
import io from 'socket.io-client';
import { create as renderer } from 'react-test-renderer';
import createContext from 'react-cosmos-test/generic';
import { CosmosNativeLoader } from '../native';

const handlers = {};
let hasConnected = false;

const mockOn = jest.fn((evt, cb) => {
  handlers[evt] = cb;
});
const mockOff = jest.fn();
const mockEmit = jest.fn();

// NOTE: Ideally we should mock socket.io using a library, but when tried
// https://github.com/thoov/mock-socket didn't capture events properly
jest.mock('socket.io-client', () =>
  jest.fn(() => {
    hasConnected = true;

    return {
      on: mockOn,
      off: mockOff,
      emit: mockEmit
    };
  })
);

const { mount } = createContext({
  renderer,
  fixture: {
    component: CosmosNativeLoader,
    props: {
      options: {
        port: 8080
      },
      modules: {
        fixtureModules: {},
        fixtureFiles: [],
        proxies: []
      }
    }
  }
});

beforeEach(async () => {
  jest.clearAllMocks();
  await mount();
});

it('calls Socket.IO client with port', async () => {
  await until(() => hasConnected);
  expect(io.mock.calls[0][0]).toContain(':8080');
});

it('emits loaderReady', async () => {
  await until(() => mockEmit.mock.calls.length > 0);
  expect(mockEmit).toHaveBeenCalledWith('cosmos-cmd', {
    type: 'loaderReady',
    fixtures: {}
  });
});

it('emits loaderReady again on request', async () => {
  await until(() => mockEmit.mock.calls.length > 0);
  handlers['cosmos-cmd']({
    type: 'uiReady'
  });

  await until(() => mockEmit.mock.calls.length > 1);
  expect(mockEmit).nthCalledWith(2, 'cosmos-cmd', {
    type: 'loaderReady',
    fixtures: {}
  });
});
