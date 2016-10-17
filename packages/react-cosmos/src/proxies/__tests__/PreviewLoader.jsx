import React from 'react';
import { shallow } from 'enzyme';
import PreviewLoader from '../PreviewLoader';

const PreviewComponent = () => {};
const fixture = {
  component: PreviewComponent,
  foo: 'bar',
  state: {
    counter: 5,
  },
};
const onPreviewRef = jest.fn();

let wrapper;
let childWrapper;
let childProps;

beforeAll(() => {
  wrapper = shallow(
    <PreviewLoader
      fixture={fixture}
      onPreviewRef={onPreviewRef}
    />
  );
  childWrapper = wrapper.at(0);
  childProps = childWrapper.props();
});

test('renders preview component', () => {
  expect(childWrapper.type()).toEqual(PreviewComponent);
});

test('sends fixture props to preview component', () => {
  expect(childProps.foo).toBe('bar');
});

test('omits fixture.component from props', () => {
  expect(childProps.component).toBe(undefined);
});

test('omits fixture.state from props', () => {
  expect(childProps.state).toBe(undefined);
});

test('sets onPreviewRef as preview component ref callback', () => {
  expect(childWrapper.get(0).ref).toBe(onPreviewRef);
});
