import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import readyFixture from '../__fixtures__/ready';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let wrapper;
let instance;
let loaderContentWindow;

describe('CP fixture select via router', () => {
  beforeEach(() => {
    return new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy]}
          component={ComponentPlayground}
          fixture={readyFixture}
          onComponentRef={i => {
            instance = i;
            resolve();
          }}
        />
      );
    }).then(() => {
      loaderContentWindow = {
        postMessage: jest.fn()
      };
      // iframe.contentWindow isn't available in jsdom
      instance.loaderFrame = {
        contentWindow: loaderContentWindow
      };

      const { props, state } = readyFixture;
      wrapper.setProps({
        fixture: {
          props: {
            ...props,
            component: 'ComponentB',
            fixture: 'qux'
          },
          state
        }
      });
    });
  });

  test('sends fixture select message to loader', () => {
    expect(loaderContentWindow.postMessage).toHaveBeenCalledWith(
      {
        type: 'fixtureSelect',
        component: 'ComponentB',
        fixture: 'qux'
      },
      '*'
    );
  });
});
