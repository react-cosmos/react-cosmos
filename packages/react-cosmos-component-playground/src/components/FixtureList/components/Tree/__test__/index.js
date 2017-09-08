import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import Tree from '../index';

import { data as fixtures } from '../__fixtures__/tree';
import {
  initialPathsOutput,
  initialTreeFromFixtures,
  treeWtihFooSelected,
  foofixtures,
  fooPaths,
  treeFromFirstPath,
  updatedTreeFromFirstPath,
  PATH_TO_FOO
} from './constants';

/* global test expect */

test('should render Tree from fixtures', () => {
  const tree = renderer.create(<Tree fixtures={fixtures} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('should render Tree from paths', () => {
  const tree = renderer.create(<Tree paths={initialPathsOutput} />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('should render Tree from tree data', () => {
  const tree = renderer
    .create(<Tree tree={initialTreeFromFixtures} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('Tree should have service property', () => {
  let treeService;
  const wrapper = mount(
    <Tree
      onReady={service => {
        treeService = service;
      }}
    />
  );
  const tree = wrapper.instance();
  expect(tree.service).toBe(treeService);
});

test('should get state updated on Node click', () => {
  const wrapper = mount(<Tree tree={initialTreeFromFixtures} />);
  const tree = wrapper.instance();
  expect(tree.state).toEqual({ tree: initialTreeFromFixtures, selected: [] });
  tree.service.select(PATH_TO_FOO);
  expect(tree.state).toEqual({
    tree: treeWtihFooSelected,
    selected: [PATH_TO_FOO]
  });
});

test('should rebuild Tree should fixtures change', () => {
  const wrapper = mount(<Tree fixtures={fixtures} />);
  const tree = wrapper.instance();
  expect(tree.state.tree).toEqual(initialTreeFromFixtures);
  wrapper.setProps({ fixtures: foofixtures });
  expect(tree.state.tree).toEqual(treeFromFirstPath);
});

test('should rebuild Tree should paths change', () => {
  const wrapper = mount(
    <Tree selectedPath={PATH_TO_FOO} paths={initialPathsOutput} />
  );
  const tree = wrapper.instance();
  expect(tree.state.tree).toEqual(treeWtihFooSelected);
  wrapper.setProps({ selectedPath: undefined, paths: fooPaths });
  expect(tree.state.tree).toEqual(treeFromFirstPath);
});

test('should rebuild Tree form other tree', () => {
  const wrapper = mount(<Tree tree={initialTreeFromFixtures} />);
  const tree = wrapper.instance();
  expect(tree.state.tree).toEqual(initialTreeFromFixtures);
  wrapper.setProps({ tree: updatedTreeFromFirstPath });
  expect(tree.state.tree).toEqual(updatedTreeFromFirstPath);
});

test('should unmount Tree', () => {
  const wrapper = mount(<Tree />);
  const tree = wrapper.instance();
  expect(tree.service.subscribers.length).toBe(1);
  wrapper.unmount();
  expect(tree.service.subscribers.length).toBe(0);
});
