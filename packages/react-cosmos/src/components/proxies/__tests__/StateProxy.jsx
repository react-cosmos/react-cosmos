import React from 'react';
import { shallow } from 'enzyme';
import createStateProxy from '../StateProxy';

jest.mock('react-component-tree');

const ReactComponentTree = require('react-component-tree');

const NextProxy = () => {};
const nextProxyNext = {};
const nextProxy = {
  value: NextProxy,
  next: () => nextProxyNext,
};
const onComponentRef = jest.fn();
const componentRef = {};

let fixture;
let onFixtureUpdate;
let StateProxy;
let wrapper;
let childWrapper;
let childProps;

const renderProxy = options => {
  fixture = options.fixture;
  onFixtureUpdate = jest.fn();

  jest.resetAllMocks();
  jest.useFakeTimers();

  ReactComponentTree.__setStateMock(options.initialState);

  StateProxy = createStateProxy({
    updateInterval: 1337,
  });
  wrapper = shallow(
    <StateProxy
      nextProxy={nextProxy}
      component={() => {}}
      fixture={fixture}
      onComponentRef={onComponentRef}
      onFixtureUpdate={onFixtureUpdate}
      disableLocalState={options.disabled}
    />,
  );
  childWrapper = wrapper.at(0);
  childProps = childWrapper.props();
  // Simulate rendering
  childProps.onComponentRef(componentRef);
};

const commonTests = () => {
  test('renders next proxy in line', () => {
    expect(childWrapper.type()).toBe(NextProxy);
  });

  test('sends nextProxy.next() to next proxy', () => {
    expect(childProps.nextProxy).toBe(nextProxyNext);
  });

  test('sends fixture props to next proxy', () => {
    expect(childProps.fixture.foo).toBe('bar');
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    expect(childProps.onFixtureUpdate).toBe(onFixtureUpdate);
  });
};

describe('fixture without state and component without initial state', () => {
  beforeAll(() => {
    renderProxy({
      fixture: {
        foo: 'bar',
      },
    });
  });

  commonTests();

  test('does not omit state from fixture sent to next proxy', () => {
    expect(childProps.fixture.state).toBe(undefined);
  });

  test('serializes component state', () => {
    expect(ReactComponentTree.serialize.mock.calls[0][0]).toBe(componentRef);
  });

  test('does not inject state', () => {
    expect(ReactComponentTree.injectState).not.toHaveBeenCalled();
  });

  test('does not call onFixtureUpdate', () => {
    expect(onFixtureUpdate).not.toHaveBeenCalled();
  });

  test('does not start update interval', () => {
    expect(setTimeout).not.toHaveBeenCalled();
  });
});

describe('fixture without state and component with initial state', () => {
  beforeAll(() => {
    renderProxy({
      fixture: {
        foo: 'bar',
      },
      initialState: {
        counter: 0,
      },
    });
  });

  commonTests();

  test('serializes component state', () => {
    expect(ReactComponentTree.serialize.mock.calls[0][0]).toBe(componentRef);
  });

  test('does not inject state', () => {
    expect(ReactComponentTree.injectState).not.toHaveBeenCalled();
  });

  test('calls onFixtureUpdate', () => {
    expect(onFixtureUpdate).toHaveBeenCalledTimes(1);
  });

  test('calls onFixtureUpdate with updated state', () => {
    expect(onFixtureUpdate.mock.calls[0][0].state).toEqual({
      counter: 0,
    });
  });

  test('starts update interval', () => {
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  describe('on unmount', () => {
    beforeAll(() => {
      wrapper.unmount();
    });

    test('clears timeout', () => {
      expect(clearTimeout).toHaveBeenCalled();
    });
  });
});

describe('fixture with state', () => {
  beforeAll(() => {
    renderProxy({
      fixture: {
        foo: 'bar',
        state: {
          counter: 6,
        },
      },
      initialState: {
        counter: 0,
      },
    });
  });

  commonTests();

  test('does not omit state from fixture sent to next proxy', () => {
    expect(childProps.fixture.state).toEqual({ counter: 6 });
  });

  test('does not serialize component state', () => {
    expect(ReactComponentTree.serialize).not.toHaveBeenCalled();
  });

  test('injects state', () => {
    const [component, state] = ReactComponentTree.injectState.mock.calls[0];
    expect(component).toBe(componentRef);
    expect(state).toEqual({
      counter: 6,
    });
  });

  test('does not call onFixtureUpdate', () => {
    // Nothing to announce
    expect(onFixtureUpdate).not.toHaveBeenCalled();
  });

  test('starts update interval', () => {
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  test('schedules timeout with options.interval', () => {
    expect(setTimeout.mock.calls[0][1]).toBe(1337);
  });

  describe('after interval without state change passes', () => {
    beforeAll(() => {
      ReactComponentTree.__setStateMock({ counter: 6 });
      jest.runOnlyPendingTimers();
    });

    test('serializes component state', () => {
      expect(ReactComponentTree.serialize).toHaveBeenCalledTimes(1);
      expect(ReactComponentTree.serialize.mock.calls[0][0]).toBe(componentRef);
    });

    test('still does not onFixtureUpdate', () => {
      // ... because component state is equal to serialized state in fixture
      expect(onFixtureUpdate).not.toHaveBeenCalled();
    });

    test('schedules another timeout', () => {
      expect(setTimeout).toHaveBeenCalledTimes(2);
    });
  });

  describe('after interval with state change passes', () => {
    beforeAll(() => {
      ReactComponentTree.__setStateMock({ counter: 7 });
      jest.runOnlyPendingTimers();
    });

    test('calls onFixtureUpdate', () => {
      expect(onFixtureUpdate).toHaveBeenCalled();
    });

    test('serializes component state again', () => {
      expect(ReactComponentTree.serialize.mock.calls[0][0]).toBe(componentRef);
    });

    test('calls onFixtureUpdate with updated state', () => {
      expect(onFixtureUpdate.mock.calls[0][0].state).toEqual({
        counter: 7,
      });
    });

    test('schedules another timeout', () => {
      expect(setTimeout).toHaveBeenCalledTimes(3);
    });
  });

  describe('on unmount', () => {
    beforeAll(() => {
      wrapper.unmount();
    });

    test('clears timeout', () => {
      expect(clearTimeout).toHaveBeenCalled();
    });
  });
});

describe('disabled by parent proxy', () => {
  beforeAll(() => {
    renderProxy({
      fixture: {
        foo: 'bar',
        state: {
          counter: 6,
        },
      },
      disabled: true,
    });
  });

  commonTests();

  test('does not omit state from fixture sent to next proxy', () => {
    expect(childProps.fixture.state).toEqual({ counter: 6 });
  });

  test('does not serialize component state', () => {
    expect(ReactComponentTree.serialize).not.toHaveBeenCalled();
  });

  test('does not inject state', () => {
    expect(ReactComponentTree.injectState).not.toHaveBeenCalled();
  });

  test('does not call onFixtureUpdate', () => {
    expect(onFixtureUpdate).not.toHaveBeenCalled();
  });

  test('does not start update interval', () => {
    expect(setTimeout.mock.calls.length).toBe(0);
  });
});
