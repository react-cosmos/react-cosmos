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
          proxies={[createStateProxy()]}
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
        postMessage: jest.fn()
      };
      // iframe.contentWindow isn't available in jsdom
      instance.loaderFrame = {
        contentWindow: loaderContentWindow
      };

      // State is already injected, but we need to trigger this event for the
      // `fixtureSelect` message event to be triggered
      window.postMessage(
        {
          type: 'loaderReady',
          fixtures: selectedFixture.state.fixtures
        },
        '*'
      );

      return onFrameReady;
    });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  it('sends fixture select message to loader', () => {
    expect(loaderContentWindow.postMessage).toHaveBeenCalledWith(
      {
        type: 'fixtureSelect',
        component: 'ComponentA',
        fixture: 'foo'
      },
      '*'
    );
  });

  describe('fixture list', () => {
    let props;

    beforeEach(() => {
      props = wrapper.find(FixtureList).props();
    });

    it('should send url params (component, fixture) to fixture list', () => {
      expect(props.urlParams).toEqual({
        component: 'ComponentA',
        fixture: 'foo'
      });
    });

    it('clicking on selected fixture sends new message to loader', () => {
      props.onUrlChange(window.location.href);
      expect(loaderContentWindow.postMessage).toHaveBeenCalledTimes(2);
      expect(loaderContentWindow.postMessage).toHaveBeenLastCalledWith(
        {
          type: 'fixtureSelect',
          component: 'ComponentA',
          fixture: 'foo'
        },
        '*'
      );
    });
  });

  describe('main menu', () => {
    const fixtureEditorUrl = '?component=ComponentA&fixture=foo&editor=true';
    const fullScreenUrl = '?component=ComponentA&fixture=foo&fullScreen=true';

    it('should render home button', () => {
      expect(wrapper.find('a[href="?"].button')).toHaveLength(1);
    });

    it('should not render selected home button', () => {
      expect(wrapper.find('a[href="?"].selectedButton')).toHaveLength(0);
    });

    it('should render fixture editor button', () => {
      expect(wrapper.find(`a[href="${fixtureEditorUrl}"].button`)).toHaveLength(
        1
      );
    });

    it('should not render selected fixture editor button', () => {
      expect(
        wrapper.find(`a[href="${fixtureEditorUrl}"].selectedButton`).length
      ).toBe(0);
    });

    it('should render full screen button', () => {
      expect(wrapper.find(`a[href="${fullScreenUrl}"].button`)).toHaveLength(1);
    });
  });

  describe('content', () => {
    it('should not render StarryBg', () => {
      expect(wrapper.find(StarryBg)).toHaveLength(0);
    });
  });
});
