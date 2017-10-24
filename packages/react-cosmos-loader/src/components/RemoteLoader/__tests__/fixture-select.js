import React from 'react';
import { mount } from 'enzyme';
import PropsProxy from '../../PropsProxy';
import RemoteLoader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const fixtureFoo = {
  onFoo: () => {},
  foo: 'bar'
};

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let firstProxyWrapper;
let firstProxyProps;
let fixtureLoadMessage;

const handleMessage = e => {
  const { type } = e.data;
  if (!messageHandlers[type]) {
    throw new Error('Unexpected message event');
  }
  messageHandlers[type](e.data);
};

const waitForPostMessage = type =>
  new Promise(resolve => {
    messageHandlers[type] = resolve;
  });

describe('Fixture is selected remotely', () => {
  beforeEach(() => {
    messageHandlers = {};
    // window recieves both incoming and outgoing messages from/to parent because
    // window.parent === window in the Jest environment
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const onFixtureSelect = waitForPostMessage('fixtureSelect');
    const onFixtureLoad = waitForPostMessage('fixtureLoad');
    wrapper = mount(
      <RemoteLoader
        proxies={[ProxyFoo]}
        fixtures={{
          Foo: {
            foo: fixtureFoo
          }
        }}
      />
    );

    return onFrameReady
      .then(() => {
        window.postMessage(
          {
            type: 'fixtureSelect',
            component: 'Foo',
            fixture: 'foo'
          },
          '*'
        );

        return onFixtureSelect;
      })
      .then(() => {
        wrapper.update();
        firstProxyWrapper = wrapper.find(ProxyFoo);
        firstProxyProps = firstProxyWrapper.props();

        return onFixtureLoad;
      })
      .then(message => {
        fixtureLoadMessage = message;
      });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('renders first proxy ', () => {
    expect(firstProxyWrapper).toHaveLength(1);
  });

  test('sets first proxy element key ', () => {
    expect(firstProxyWrapper.key()).toBeDefined();
  });

  test('sends PropsProxy to first proxy ', () => {
    expect(firstProxyProps.nextProxy.value).toBe(PropsProxy);
  });

  test('sends fixture to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual(fixtureFoo);
  });

  test('sends onFixtureUpdate cb to first proxy ', () => {
    expect(firstProxyProps.onFixtureUpdate).toBe(
      wrapper.instance().onFixtureUpdate
    );
  });

  test('sends fixtureLoad event to parent with fixture body', () => {
    expect(fixtureLoadMessage).toEqual({
      type: 'fixtureLoad',
      fixtureBody: {
        foo: 'bar'
      }
    });
  });
});
