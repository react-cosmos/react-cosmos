import React, { Component } from 'react';
import { shallow } from 'enzyme';
import importComponent from '../import-component';

const statelessComponent = () => <div />;

class classComponent extends Component {
  render() {
    return <div />;
  }
}

test('returns stateless component from es module', () => {
  const module = {
    __esModule: true,
    default: statelessComponent
  };
  expect(importComponent(module)).toBe(statelessComponent);
});

test('returns class component from es module', () => {
  const module = {
    __esModule: true,
    default: classComponent
  };
  expect(importComponent(module)).toBe(classComponent);
});

test('returns invalid component from es module', () => {
  const module = {
    __esModule: true,
    default: {}
  };
  const MissingComponent = importComponent(module);
  expect(shallow(<MissingComponent />).text()).toEqual(
    'Not a valid React component'
  );
});

test('returns invalid named component from es module', () => {
  const module = {
    __esModule: true,
    default: {}
  };
  const MissingComponent = importComponent(module, 'Foo');
  expect(shallow(<MissingComponent />).text()).toEqual(
    'Foo is not a valid React component'
  );
});

test('returns stateless component from commonjs module', () => {
  expect(importComponent(statelessComponent)).toBe(statelessComponent);
});

test('returns class component from commonjs module', () => {
  expect(importComponent(classComponent)).toBe(classComponent);
});

test('returns invalid component from commonjs module', () => {
  const MissingComponent = importComponent({}, 'Foo');
  expect(shallow(<MissingComponent />).text()).toEqual(
    'Foo is not a valid React component'
  );
});

test('returns invalid named component from commonjs module', () => {
  const MissingComponent = importComponent({});
  expect(shallow(<MissingComponent />).text()).toEqual(
    'Not a valid React component'
  );
});
