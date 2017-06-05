import React from 'react';
import { mount } from 'enzyme';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let messageHandlers;
let router;
let wrapper;
let loaderContentWindow;

const handleMessage = e => {
  const { type } = e.data;
  if (!messageHandlers[type]) {
    throw new Error('Unexpected message event');
  }
  messageHandlers[type](e.data);
};

const waitForPostMessage = type => new Promise(resolve => {
  messageHandlers[type] = resolve;
});

describe('CP fixture select via router', () => {
  beforeEach(() => {
    messageHandlers = {};
    window.addEventListener('message', handleMessage, false);

    router = {
      goTo: jest.fn()
    };

    const onFrameReady = waitForPostMessage('loaderReady');

    // Mounting component in order for lifecycle methods to be called
    wrapper = mount(
      <ComponentPlayground
        loaderUri="/loader/index.html"
        router={router}
      />
    );

    window.postMessage({
      type: 'loaderReady',
      fixtures: {
        ComponentA: ['foo', 'bar'],
        ComponentB: ['baz', 'qux'],
      }
    }, '*');

    return onFrameReady.then(() => {
      loaderContentWindow = {
        postMessage: jest.fn()
      };
      // iframe.contentWindow isn't available in jsdom
      wrapper.instance().loaderFrame = {
        contentWindow: loaderContentWindow
      };
      wrapper.setProps({
        component: 'ComponentB',
        fixture: 'qux'
      });
    });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('sends fixture select message to loader', () => {
    expect(loaderContentWindow.postMessage).toHaveBeenCalledWith({
      type: 'fixtureSelect',
      component: 'ComponentB',
      fixture: 'qux',
    }, '*');
  });
});
