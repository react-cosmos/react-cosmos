import React from 'react';
import { mount } from 'enzyme';
import FixtureList from '../../FixtureList';
import WelcomeScreen from '../../WelcomeScreen';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let messageHandlers;
let router;
let wrapper;

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

describe('CP loader ready', () => {
  beforeEach(() => {
    messageHandlers = {};
    window.addEventListener('message', handleMessage, false);

    router = {
      goTo: jest.fn(),
    };

    const onFrameReady = waitForPostMessage('loaderReady');

    // Mounting component in order for lifecycle methods to be called
    wrapper = mount(
      <ComponentPlayground loaderUri="/loader/index.html" router={router} />
    );

    window.postMessage(
      {
        type: 'loaderReady',
        fixtures: {
          ComponentA: ['foo', 'bar'],
          ComponentB: ['baz', 'qux'],
        },
      },
      '*'
    );

    return onFrameReady;
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  describe('fixture list', () => {
    let props;

    beforeEach(() => {
      props = wrapper.find(FixtureList).props();
    });

    test('should render fixture list', () => {
      expect(wrapper.find(FixtureList).length).toEqual(1);
    });

    test('should send fixtures to fixture list', () => {
      expect(props.fixtures).toEqual({
        ComponentA: ['foo', 'bar'],
        ComponentB: ['baz', 'qux'],
      });
    });

    test('should send empty url params to fixture list', () => {
      expect(Object.keys(props.urlParams)).toEqual([]);
    });

    test('should go to URL from fixture list handler', () => {
      props.onUrlChange('/path/to/location');
      expect(router.goTo).toHaveBeenCalledWith('/path/to/location');
    });
  });

  describe('main menu', () => {
    test('should render home button', () => {
      expect(wrapper.find('a[href="/"].button').length).toBe(1);
    });

    test('should render selected home button', () => {
      expect(wrapper.find('a[href="/"].selectedButton').length).toBe(1);
    });
  });

  describe('welcome screen', () => {
    test('should render welcome screen', () => {
      expect(wrapper.find(WelcomeScreen).length).toEqual(1);
    });

    test('should send fixtures to welcome screen', () => {
      expect(wrapper.find(WelcomeScreen).prop('fixtures')).toEqual({
        ComponentA: ['foo', 'bar'],
        ComponentB: ['baz', 'qux'],
      });
    });
  });
});
