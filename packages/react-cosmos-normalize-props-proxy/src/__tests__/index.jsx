import React from 'react';
import { shallow } from 'enzyme';
import createNormalizePropsProxy from '../index';

const NextProxy = () => {};
const nextProxyNext = {};
const nextProxy = {
  value: NextProxy,
  next: () => nextProxyNext,
};
const onComponentRef = jest.fn();
const onFixtureUpdate = jest.fn();

let NormalizePropsProxy;
let componentRef;
let childWrapper;
let childProps;

const mockContext = {};
const mockChildren = [];
const mockState = {};
const mockReduxState = {};

const renderProxy = fixture => {
  componentRef = {};

  jest.resetAllMocks();
  NormalizePropsProxy = createNormalizePropsProxy();
  const wrapper = shallow(
    <NormalizePropsProxy
      nextProxy={nextProxy}
      component={() => {}}
      fixture={fixture}
      onComponentRef={onComponentRef}
      onFixtureUpdate={onFixtureUpdate}
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

  test('sends designated root level fixture fields to next proxy unmodified', () => {
    expect(childProps.fixture.context).toBe(mockContext);
    expect(childProps.fixture.children).toBe(mockChildren);
    expect(childProps.fixture.state).toBe(mockState);
    expect(childProps.fixture.reduxState).toBe(mockReduxState);
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    childProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls.length).toBe(1);
  });
};

describe('fixture without fixture.props', () => {
  beforeAll(() => {
    renderProxy({
      context: mockContext,
      children: mockChildren,
      state: mockState,
      reduxState: mockReduxState,
      foo: 'bar',
    });
  });

  commonTests();

  test('sends root level fixture props to next proxy on fixture.props', () => {
    expect(childProps.fixture.props.foo).toEqual('bar');
  });
});

describe('fixture with fixture.props', () => {
  beforeAll(() => {
    renderProxy({
      context: mockContext,
      children: mockChildren,
      state: mockState,
      reduxState: mockReduxState,
      foo: 'bar',
      props: {
        car: 'honda',
      },
    });
  });

  commonTests();

  test('does not send root level fixture props to next proxy on fixture.props', () => {
    expect(childProps.fixture.props.foo).toBeUndefined();
  });
  test('sends existings fixture.props to next proxy unmodified', () => {
    expect(childProps.fixture.props.car).toEqual('honda');
  });
});
