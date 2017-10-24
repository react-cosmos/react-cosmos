import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import { shallow } from 'enzyme';
import PropsProxy from '../';

const FunctionalComponent = () => {};

class ClassComponent extends Component {
  render() {}
}

const ClassicComponent = createReactClass({
  render: () => {}
});

const fixture = {
  props: {
    foo: 'bar'
  },
  children: [<p key="1">Child 1</p>]
};
const onComponentRef = jest.fn();

let wrapper;
let childWrapper;
let childProps;
let childChildren;

describe('Functional Component', () => {
  beforeEach(() => {
    wrapper = shallow(
      <PropsProxy
        fixture={{
          component: FunctionalComponent,
          ...fixture
        }}
        onComponentRef={onComponentRef}
      />
    );
    childWrapper = wrapper.at(0);
    childProps = childWrapper.props();
    childChildren = childWrapper.children();
  });

  test('renders component', () => {
    expect(childWrapper.type()).toEqual(FunctionalComponent);
  });

  test('sends fixture props to component', () => {
    expect(childProps.foo).toBe('bar');
  });

  test('does not sets onComponentRef as component ref callback', () => {
    expect(childWrapper.get(0).ref).toBeFalsy();
  });

  test('passes children to component', () => {
    expect(childChildren.length).toEqual(1);
    expect(childChildren.at(0).equals(fixture.children[0])).toBe(true);
  });
});

describe('ES6 Class Component', () => {
  beforeEach(() => {
    wrapper = shallow(
      <PropsProxy
        fixture={{
          component: ClassComponent,
          ...fixture
        }}
        onComponentRef={onComponentRef}
      />
    );
    childWrapper = wrapper.at(0);
    childProps = childWrapper.props();
    childChildren = childWrapper.children();
  });

  test('renders component', () => {
    expect(childWrapper.type()).toEqual(ClassComponent);
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
});

describe('React.createClass', () => {
  beforeEach(() => {
    wrapper = shallow(
      <PropsProxy
        fixture={{
          component: ClassicComponent,
          ...fixture
        }}
        onComponentRef={onComponentRef}
      />
    );
    childWrapper = wrapper.at(0);
    childProps = childWrapper.props();
    childChildren = childWrapper.children();
  });

  test('renders component', () => {
    expect(childWrapper.type()).toEqual(ClassicComponent);
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
});
