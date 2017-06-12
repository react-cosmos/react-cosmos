import React from 'react';
import { mount } from 'enzyme';
import RemoteLoader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const ComponentFoo = () => <span />;
const ComponentFoo2 = () => <span />;
const fixtureFoo = {};

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let firstProxyWrapper;

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

describe('Component source changes', () => {
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
        components={{
          Foo: ComponentFoo,
        }}
        fixtures={{
          Foo: {
            foo: fixtureFoo,
          },
        }}
        component="Foo"
        fixture="foo"
      />
    );

    return onFrameReady
      .then(() => {
        window.postMessage(
          {
            type: 'fixtureSelect',
            component: 'Foo',
            fixture: 'foo',
          },
          '*'
        );

        return onFixtureSelect;
      })
      .then(() => onFixtureLoad)
      .then(() => {
        wrapper.setProps({
          components: {
            Foo: ComponentFoo2,
          },
        });

        firstProxyWrapper = wrapper.find(ProxyFoo);
      });
  });

  test('sends new component to proxies', () => {
    expect(firstProxyWrapper.props().component).toBe(ComponentFoo2);
  });
});
