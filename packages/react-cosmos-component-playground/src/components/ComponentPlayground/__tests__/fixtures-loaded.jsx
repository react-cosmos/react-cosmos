import React from 'react';
import merge from 'lodash.merge';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import readyFixture from '../__fixtures__/ready';
import FixtureList from '../../FixtureList';
import WelcomeScreen from '../../WelcomeScreen';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let router;
let wrapper;

describe('CP fixtures loaded', () => {
  beforeEach(() => {
    router = {
      goTo: jest.fn(),
    };
    const fixture = merge({}, readyFixture, {
      props: {
        router,
      },
    });

    return new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy]}
          component={ComponentPlayground}
          fixture={fixture}
          onComponentRef={() => {
            resolve();
          }}
        />
      );
    });
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
