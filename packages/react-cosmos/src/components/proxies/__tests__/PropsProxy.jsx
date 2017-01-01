import React from 'react';
import { shallow } from 'enzyme';
import PropsProxy from '../PropsProxy';

const Component = () => {};
const fixture = {
  foo: 'bar',
};
const onComponentRef = jest.fn();

let wrapper;
let childWrapper;
let childProps;

beforeAll(() => {
  wrapper = shallow(
    <PropsProxy
      component={Component}
      fixture={fixture}
      onComponentRef={onComponentRef}
    />,
  );
  childWrapper = wrapper.at(0);
  childProps = childWrapper.props();
});

test('renders component', () => {
  expect(childWrapper.type()).toEqual(Component);
});

test('sends fixture props to component', () => {
  expect(childProps.foo).toBe('bar');
});

test('sets onComponentRef as component ref callback', () => {
  expect(childWrapper.get(0).ref).toBe(onComponentRef);
});
