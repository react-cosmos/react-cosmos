import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import readyFixture from '../__fixtures__/ready';

// Vars populated in beforeEach blocks
let wrapper;
let instance;
let loaderContentWindow;

describe('CP fixture select via router', () => {
  beforeEach(() => {
    // Mount component in order for ref and lifecycle methods to be called
    wrapper = mount(
      <Loader
        proxies={[createStateProxy()]}
        fixture={readyFixture}
        onComponentRef={i => {
          instance = i;
        }}
      />
    );

    return Promise.resolve().then(() => {
      loaderContentWindow = {
        postMessage: jest.fn()
      };
      // iframe.contentWindow isn't available in jsdom
      instance.loaderFrame = {
        contentWindow: loaderContentWindow
      };

      const { props } = readyFixture;
      wrapper.setProps({
        fixture: {
          ...readyFixture,
          props: {
            ...props,
            component: 'ComponentB',
            fixture: 'qux'
          }
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
