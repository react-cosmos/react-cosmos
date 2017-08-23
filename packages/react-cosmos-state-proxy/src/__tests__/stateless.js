import React from 'react';
import { shallow } from 'enzyme';
import createStateProxy from '../';

// Vars populated in beforeEach blocks
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let componentRef;
let onComponentRef;
let onFixtureUpdate;
let StateProxy;
let wrapper;
let props;

describe('React state proxy – stateless', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();

    // Objects to check identity against
    NextProxy = () => {};
    nextProxyNext = {};
    nextProxy = {
      value: NextProxy,
      next: () => nextProxyNext,
    };
    Component = () => {};
    componentRef = {};
    onComponentRef = jest.fn();
    onFixtureUpdate = jest.fn();

    StateProxy = createStateProxy({
      updateInterval: 1337,
    });

    return new Promise(resolve => {
      wrapper = shallow(
        <StateProxy
          nextProxy={nextProxy}
          component={Component}
          fixture={{
            foo: 'bar',
          }}
          onComponentRef={ref => {
            onComponentRef(ref);
            resolve();
          }}
          onFixtureUpdate={onFixtureUpdate}
        />
      );

      // These are the props of the next proxy
      props = wrapper.props();

      // Simulate rendering
      props.onComponentRef(componentRef);
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('renders next proxy in line', () => {
    expect(wrapper.type()).toBe(NextProxy);
  });

  test('sends nextProxy.next() to next proxy', () => {
    expect(props.nextProxy).toBe(nextProxyNext);
  });

  test('sends component to next proxy', () => {
    expect(props.component).toBe(Component);
  });

  test('sends fixture to next proxy', () => {
    expect(props.fixture).toEqual({
      foo: 'bar',
    });
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    expect(props.onFixtureUpdate).toBe(onFixtureUpdate);
  });

  test('does not call onFixtureUpdate', () => {
    expect(onFixtureUpdate).not.toHaveBeenCalled();
  });

  test('does not start update interval', () => {
    expect(setTimeout).not.toHaveBeenCalled();
  });
});
