import React from 'react';
import merge from 'lodash.merge';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import treeFixture from '../__fixtures__/tree';
import treeWithEditorAndFullScreenParams from '../__fixtures__/tree-with-editor-and-full-screen-params';
import treeWithSearchFixture from '../__fixtures__/tree-with-search';
import { FolderIcon, ComponentIcon } from '../../SvgIcon';

describe('Tree', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Loader fixture={treeFixture} />);
  });

  test('should render component names', () => {
    const dirA = wrapper.find('.componentName').at(0);
    expect(dirA.text()).toContain('dirA');

    const component1 = wrapper.find('.componentName').at(1);
    expect(component1.text()).toContain('Component1');

    const fixtureA = wrapper.find('.fixture').at(0);
    expect(fixtureA.text()).toContain('fixtureA');
  });

  test('should render appropriate icon', () => {
    const dirA = wrapper.find('.componentName').at(0);
    expect(dirA.find(FolderIcon).length).toEqual(1);

    const component1 = wrapper.find('.componentName').at(1);
    expect(component1.find(ComponentIcon).length).toEqual(1);

    const fixtureA = wrapper.find('.fixture').at(0);
    expect(fixtureA.find(FolderIcon).length).toEqual(0);
    expect(fixtureA.find(ComponentIcon).length).toEqual(0);
  });

  test('should indent child nodes', () => {
    const dirA = wrapper.find('.componentName').get(0);
    expect(dirA.props.style.paddingLeft).toEqual(10);

    const component1 = wrapper.find('.componentName').get(1);
    expect(component1.props.style.paddingLeft).toEqual(30);

    const fixtureA = wrapper.find('.fixture').get(0);
    expect(fixtureA.props.style.paddingLeft).toEqual(70);
  });
});

describe('Basic Links', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Loader fixture={treeFixture} />);
  });

  test('should render fixture links', () => {
    const fixtureA = wrapper.find('.fixture').at(0);
    expect(fixtureA.prop('href')).toEqual(
      '?component=dirA%2FComponent1&fixture=fixtureA'
    );
  });
});

describe('Links with URL Params', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Loader fixture={treeWithEditorAndFullScreenParams} />);
  });

  test('should render fixture links', () => {
    const fixtureA = wrapper.find('.fixture').at(0);
    expect(fixtureA.prop('href')).toEqual(
      '?editor=true&fullScreen=true&component=dirA%2FComponent1&fixture=fixtureA'
    );
  });
});

describe('Fixture Select', () => {
  let wrapper;
  let onSelect;

  beforeEach(() => {
    onSelect = jest.fn();
    const fixture = merge({}, treeFixture, {
      props: {
        onSelect
      }
    });
    wrapper = mount(<Loader fixture={fixture} />);
  });

  test('should call onSelect callback on fixture click', () => {
    const fixtureA = wrapper.find('.fixture').at(0);
    fixtureA.simulate('click', {
      preventDefault: jest.fn()
    });

    expect(onSelect).toHaveBeenCalledWith(
      `http://foo.bar/${fixtureA.prop('href')}`
    );
  });
});

describe('Node Select', () => {
  let wrapper;
  let onToggle;

  beforeEach(() => {
    onToggle = jest.fn();
    const fixture = merge({}, treeFixture, {
      props: {
        onToggle
      }
    });
    wrapper = mount(<Loader fixture={fixture} />);
  });

  test('should call onToggle callback on click', () => {
    const component1 = wrapper.find('.componentName').at(1);
    component1.simulate('click', {
      preventDefault: jest.fn()
    });

    expect(onToggle).toHaveBeenCalled();
  });
});

describe('Search Highlight', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Loader fixture={treeWithSearchFixture} />);
  });

  test('should highlight letters "sub A"', () => {
    const highlightS = wrapper.find('mark').at(0);
    expect(highlightS.text()).toContain('s');
    const highlightU = wrapper.find('mark').at(1);
    expect(highlightU.text()).toContain('u');
    const highlightB = wrapper.find('mark').at(2);
    expect(highlightB.text()).toContain('b');
    const highlightA = wrapper.find('mark').at(3);
    expect(highlightA.text()).toContain('A');
  });
});
