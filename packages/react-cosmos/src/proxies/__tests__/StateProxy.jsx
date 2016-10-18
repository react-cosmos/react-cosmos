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
const onPreviewRef = jest.fn();

let fixture;
let previewComponent;
let stateMock;
let onFixtureUpdate;
let StateProxy;
let wrapper;
let childWrapper;
let childProps;

jest.useFakeTimers();

const renderProxy = (f, disabled = false) => {
  fixture = f;
  previewComponent = f.state ? { state: f.state } : {};
  onFixtureUpdate = jest.fn();

  jest.clearAllMocks();

  StateProxy = createStateProxy({
    updateInterval: 1337,
  });
  wrapper = shallow(
    <StateProxy
      nextProxy={nextProxy}
      fixture={fixture}
      onPreviewRef={onPreviewRef}
      onFixtureUpdate={onFixtureUpdate}
      disableLocalState={disabled}
    />
  );
  childWrapper = wrapper.at(0);
  childProps = childWrapper.props();
  // Simulate renedering of preview component
  childProps.onPreviewRef(previewComponent);
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

  test('bubbles up preview ref', () => {
    expect(onPreviewRef.mock.calls[0][0]).toBe(previewComponent);
  });

  test('bubbles up fixture updates', () => {
    expect(childProps.onFixtureUpdate).toBe(onFixtureUpdate);
  });
};

describe('fixture without state', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar',
    });
  });

  commonTests();

  test('omits state from fixture sent to next proxy', () => {
    expect(childProps.fixture.state).toBe(undefined);
  });

  test('serializes preview component', () => {
    expect(ReactComponentTree.serialize.mock.calls[0][0]).toBe(previewComponent);
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

describe('fixture with state', () => {
  beforeAll(() => {
    stateMock = { counter: 6 };
    ReactComponentTree.__setStateMock(stateMock);

    renderProxy({
      foo: 'bar',
      state: {
        counter: 6,
      },
    });
  });

  commonTests();

  test('omits state from fixture sent to next proxy', () => {
    expect(childProps.fixture.state).toBe(undefined);
  });

  test('serializes preview component', () => {
    expect(ReactComponentTree.serialize.mock.calls[0][0]).toBe(previewComponent);
  });

  test('injects state', () => {
    const [component, state] = ReactComponentTree.injectState.mock.calls[0];
    expect(component).toBe(previewComponent);
    expect(state).toBe(fixture.state);
  });

  test('starts update interval', () => {
    expect(setTimeout.mock.calls.length).toBe(1);
  });

  test('does not call onFixtureUpdate', () => {
    // because component state is equal to serialized state in fixture
    expect(onFixtureUpdate).not.toHaveBeenCalled();
  });

  test('schedules timeout', () => {
    expect(setTimeout.mock.calls.length).toBe(1);
  });

  test('schedules timeout with options.interval', () => {
    expect(setTimeout.mock.calls[0][1]).toBe(1337);
  });

  describe('after interval without state change passes', () => {
    beforeAll(() => {
      jest.runOnlyPendingTimers();
    });

    test('serializes preview component again', () => {
      expect(ReactComponentTree.serialize.mock.calls[1][0]).toBe(previewComponent);
    });

    test('still does not onFixtureUpdate', () => {
      expect(onFixtureUpdate).not.toHaveBeenCalled();
    });

    test('schedules another timeout', () => {
      expect(setTimeout.mock.calls.length).toBe(2);
    });
  });

  describe('after interval with state change passes', () => {
    beforeAll(() => {
      // Simulate state change inside preview component
      stateMock = { counter: 7 };
      ReactComponentTree.__setStateMock(stateMock);

      jest.runOnlyPendingTimers();
    });

    test('calls onFixtureUpdate once again', () => {
      expect(onFixtureUpdate.mock.calls.length).toBe(1);
    });

    test('serializes preview component again', () => {
      expect(ReactComponentTree.serialize.mock.calls[2][0]).toBe(previewComponent);
    });

    test('calls onFixtureUpdate with updated state', () => {
      // Double check paranoia
      expect(onFixtureUpdate.mock.calls[0][0].state).toBe(stateMock);
      expect(onFixtureUpdate.mock.calls[0][0].state.counter).toBe(7);
    });

    test('schedules another timeout', () => {
      expect(setTimeout.mock.calls.length).toBe(3);
    });
  });

  describe('on unmount', () => {
    beforeAll(() => {
      wrapper.unmount();
    });

    test('clears timeout', () => {
      expect(clearTimeout.mock.calls.length).toBe(1);
    });
  });
});

describe('disabled by parent proxy', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar',
      state: {
        counter: 6,
      },
    }, true);
  });

  commonTests();

  test('does not omit state from fixture sent to next proxy', () => {
    expect(childProps.fixture.state).toEqual({ counter: 6 });
  });

  test('does not serialize preview component', () => {
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
