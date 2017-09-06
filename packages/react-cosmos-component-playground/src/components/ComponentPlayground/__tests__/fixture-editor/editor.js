import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedEditorFixture from '../../__fixtures__/selected-editor';
import FixtureEditor from '../../../FixtureEditor';
import ComponentPlayground from '../../';

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
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

describe('Fixture editor', () => {
  beforeEach(() => {
    messageHandlers = {};
    window.addEventListener('message', handleMessage, false);

    const onFixtureLoad = waitForPostMessage('fixtureLoad');

    return new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy()]}
          component={ComponentPlayground}
          fixture={selectedEditorFixture}
          onComponentRef={resolve}
        />
      );
    }).then(instance => {
      loaderContentWindow = {
        postMessage: jest.fn()
      };
      // iframe.contentWindow isn't available in jsdom
      instance.loaderFrame = {
        contentWindow: loaderContentWindow
      };

      window.postMessage(
        {
          type: 'fixtureLoad',
          fixtureBody: {
            foo: 'bar'
          }
        },
        '*'
      );

      return onFixtureLoad;
    });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  it('sends initial fixture body as value to FixtureEditor', () => {
    expect(wrapper.find(FixtureEditor).prop('value')).toEqual({
      foo: 'bar'
    });
  });

  describe('on fixture update from Loader', () => {
    beforeEach(() => {
      const onFixtureUpdate = waitForPostMessage('fixtureUpdate');

      window.postMessage(
        {
          type: 'fixtureUpdate',
          fixtureBody: {
            baz: 'qux'
          }
        },
        '*'
      );

      return onFixtureUpdate;
    });

    it('sends updated fixture body as value to FixtureEditor', () => {
      expect(wrapper.find(FixtureEditor).prop('value')).toEqual({
        foo: 'bar',
        baz: 'qux'
      });
    });
  });

  describe('on fixture edit from editor', () => {
    beforeEach(() => {
      wrapper.find(FixtureEditor).prop('onChange')({
        foo: 'baz'
      });
    });

    it('sends edited fixture body to Loader', () => {
      expect(loaderContentWindow.postMessage).toHaveBeenCalledWith(
        {
          type: 'fixtureEdit',
          fixtureBody: {
            foo: 'baz'
          }
        },
        '*'
      );
    });
  });
});
