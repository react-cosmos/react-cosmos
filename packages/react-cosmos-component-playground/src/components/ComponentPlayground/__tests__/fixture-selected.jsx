import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedFixture from '../__fixtures__/selected';
import StarryBg from '../../StarryBg';
import FixtureList from '../../FixtureList';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let instance;
let loaderContentWindow;

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

describe('CP with fixture already selected', () => {
  beforeEach(() => {
    messageHandlers = {};
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const waitToRender = new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy]}
          component={ComponentPlayground}
          fixture={selectedFixture}
          onComponentRef={i => {
            instance = i;
            resolve();
          }}
        />
      );
    });

    return waitToRender.then(() => {
      loaderContentWindow = {
        postMessage: jest.fn(),
      };
      // iframe.contentWindow isn't available in jsdom
      instance.loaderFrame = {
        contentWindow: loaderContentWindow,
      };

      // State is already injected, but we need to trigger this event for the
      // `fixtureSelect` message event to be triggered
      window.postMessage(
        {
          type: 'loaderReady',
          fixtures: selectedFixture.state.fixtures,
        },
        '*'
      );

      return onFrameReady;
    });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('sends fixture select message to loader', () => {
    expect(loaderContentWindow.postMessage).toHaveBeenCalledWith(
      {
        type: 'fixtureSelect',
        component: 'ComponentA',
        fixture: 'foo',
      },
      '*'
    );
  });

  describe('fixture list', () => {
    let props;

    beforeEach(() => {
      props = wrapper.find(FixtureList).props();
    });

    test('should send url params (component, fixture) to fixture list', () => {
      expect(props.urlParams).toEqual({
        component: 'ComponentA',
        fixture: 'foo',
      });
    });
  });

  describe('main menu', () => {
    const fixtureEditorUrl = '/?component=ComponentA&fixture=foo&editor=true';
    const fullScreenUrl = '/?component=ComponentA&fixture=foo&fullScreen=true';

    test('should render home button', () => {
      expect(wrapper.find('a[href="/"].button').length).toBe(1);
    });

    test('should not render selected home button', () => {
      expect(wrapper.find('a[href="/"].selectedButton').length).toBe(0);
    });

    test('should render fixture editor button', () => {
      expect(wrapper.find(`a[href="${fixtureEditorUrl}"].button`).length).toBe(
        1
      );
    });

    test('should not render selected fixture editor button', () => {
      expect(
        wrapper.find(`a[href="${fixtureEditorUrl}"].selectedButton`).length
      ).toBe(0);
    });

    test('should render full screen button', () => {
      expect(wrapper.find(`a[href="${fullScreenUrl}"].button`).length).toBe(1);
    });
  });

  describe('content', () => {
    test('should not render StarryBg', () => {
      expect(wrapper.find(StarryBg).length).toBe(0);
    });
  });
});
