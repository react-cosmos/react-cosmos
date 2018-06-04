import PropTypes from 'prop-types';
import React from 'react';
import { shallow } from 'enzyme';
import { createContextProxy } from '..';

const NextProxy = () => {};
const nextProxyNext = {};
const nextProxy = {
  value: NextProxy,
  next: () => nextProxyNext
};
const onComponentRef = jest.fn();
const onFixtureUpdate = jest.fn();

let componentRef;
let childWrapper;
let childProps;
let getChildContext;

const renderProxy = (fixture, options) => {
  componentRef = {};

  jest.resetAllMocks();

  const ContextProxy = createContextProxy({
    ...options,
    childContextTypes: {
      color: PropTypes.string
    }
  });
  const wrapper = shallow(
    <ContextProxy
      nextProxy={nextProxy}
      fixture={fixture}
      onComponentRef={onComponentRef}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
  childWrapper = wrapper.at(0);
  childProps = childWrapper.props();
  getChildContext = wrapper.instance().getChildContext();

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
    expect(childProps.fixture.foo).toEqual('bar');
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    childProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });
};

describe('fixture without context', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar'
    });
  });

  commonTests();

  test('child context is empty', () => {
    expect(getChildContext).toEqual({});
  });
});

describe('fixture context', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar',
      context: {
        color: 'red'
      }
    });
  });

  commonTests();

  test('child context is populated', () => {
    expect(getChildContext).toEqual({
      color: 'red'
    });
  });
});
