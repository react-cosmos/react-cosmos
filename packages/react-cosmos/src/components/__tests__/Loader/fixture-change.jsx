import React from 'react';
import { mount } from 'enzyme';
import Loader from '../../Loader';

// Objects to check identity against
const ProxyFoo = () => <span />;
const ComponentFoo = () => {};
const fixtureFoo = { foo: 'bar', onClick: () => {} };
const fixtureFoo2 = { foo: 'baz' };

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let firstProxyWrapper;
let firstProxyProps;
let firstProxyKey;
let fixtureUpdateMessage;

const handleParentMessage = e => {
  const { type } = e.data;
  if (!messageHandlers[type]) {
    throw new Error('Unexpected message event');
  }
  messageHandlers[type](e.data);
};

const waitForPostMessage = type => new Promise(resolve => {
  messageHandlers[type] = resolve;
});

describe('Fixture source changes', () => {
  beforeEach(() => {
    messageHandlers = {};
    parent.addEventListener('message', handleParentMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const onFixtureSelect = waitForPostMessage('fixtureSelect');
    const onFixtureUpdate = waitForPostMessage('fixtureUpdate');
    wrapper = mount(
      <Loader
        proxies={[ProxyFoo]}
        components={{
          Foo: ComponentFoo,
        }}
        fixtures={{
          Foo: {
            foo: fixtureFoo,
          }
        }}
      />,
    );

    return onFrameReady.then(() => {
      window.postMessage({
        type: 'fixtureSelect',
        component: 'Foo',
        fixture: 'foo',
      }, '*');

      return onFixtureSelect;
    }).then(() => {
      firstProxyKey = wrapper.find(ProxyFoo).key();

      wrapper.setProps({
        fixtures: {
          Foo: {
            foo: fixtureFoo2,
          }
        }
      });

      firstProxyWrapper = wrapper.find(ProxyFoo);
      firstProxyProps = firstProxyWrapper.props();

      return onFixtureUpdate;
    }).then(data => {
      fixtureUpdateMessage = data;
    });
  });

  afterEach(() => {
    messageHandlers = {};
    parent.removeEventListener('message', handleParentMessage);
  });

  test('sends updated fixture body to parent', () => {
    expect(fixtureUpdateMessage).toEqual({
      type: 'fixtureUpdate',
      fixtureBody: fixtureFoo2,
    });
  });

  test('sends updated fixture to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual(fixtureFoo2);
  });

  test('changes element key', () => {
    expect(firstProxyWrapper.key()).not.toEqual(firstProxyKey);
  });
});
