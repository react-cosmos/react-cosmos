// @flow

import React from 'react';
import until from 'async-until';
import io from 'socket.io-client';
// https://github.com/facebook/react-native/issues/19797
// $FlowFixMe
import { View, Text } from 'react-native';
import { create as render } from 'react-test-renderer';
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

const Proxy = props => {
  const { nextProxy } = props;

  return (
    <View>
      <Text>I am proxy</Text>
      <nextProxy.value {...props} nextProxy={nextProxy.next()} />
    </View>
  );
};
const proxiesEsModule = { __esModule: true, default: [Proxy] };

const Component = () => 'I am component';
const fixture = { component: Component };
const fixtureEsModule = { __esModule: true, default: fixture };

let wrapper;

beforeEach(async () => {
  jest.clearAllMocks();
  wrapper = render(
    <CosmosNativeLoader
      options={{
        port: 8080
      }}
      modules={{
        fixtureModules: { '/path/to/fixture': fixtureEsModule },
        fixtureFiles: [{ filePath: '/path/to/fixture', components: [] }],
        proxies: proxiesEsModule
      }}
    />
  );
});

afterEach(() => {
  wrapper.unmount();
});

it('calls Socket.IO client with port', async () => {
  await until(() => hasConnected);
  expect(io.mock.calls[0][0]).toContain(':8080');
});

it('emits loaderReady', async () => {
  await until(() => mockEmit.mock.calls.length > 0);
  expect(mockEmit).toHaveBeenCalledWith('cosmos-cmd', {
    type: 'loaderReady',
    fixtures: { Component: ['fixture'] }
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
    fixtures: { Component: ['fixture'] }
  });
});

describe('on select', () => {
  beforeEach(async () => {
    await until(() => mockEmit.mock.calls.length > 0); // loaderReady
    handlers['cosmos-cmd']({
      type: 'fixtureSelect',
      component: 'Component',
      fixture: 'fixture'
    });

    await until(() => mockEmit.mock.calls.length > 1);
    expect(mockEmit).nthCalledWith(2, 'cosmos-cmd', {
      type: 'fixtureLoad',
      fixtureBody: {}
    });
  });

  it('renders proxy', () => {
    expect(wrapper.toJSON().children[0].children).toContain('I am proxy');
  });

  it('renders selected fixture component', async () => {
    expect(wrapper.toJSON().children).toContain('I am component');
  });
});
