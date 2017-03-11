import React from 'react';
import { shallow } from 'enzyme';
import PropsProxy from '../PropsProxy';

const Component = () => {};
const fixture = {
  props: {
    foo: 'bar'
  },
  children: [
    <p key="1">Child 1</p>,
  ],
};
const onComponentRef = jest.fn();

let wrapper;
let childWrapper;
let childProps;
let childChildren;

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
  childChildren = childWrapper.children();
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

test('passes children to component', () => {
  expect(childChildren.length).toEqual(1);
  expect(childChildren.at(0).equals(fixture.children[0])).toBe(true);
});
