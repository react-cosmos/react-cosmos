import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { data as folder } from '../__fixtures__/folder';
import { data as file } from '../__fixtures__/file';
import { data as open } from '../__fixtures__/open';

import Icon from '../icons/DefaultFileIcon';
import Node from '../index';

/* global jest describe test expect  */

describe('Tree Node', () => {
  test('should render Node as closed folder with no arrow', () => {
    const tree = renderer.create(<Node {...folder} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render Node as file', () => {
    const tree = renderer.create(<Node {...file} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render open Node with child', () => {
    const tree = renderer
      .create(
        <Node {...open}>
          <Node {...file} />
        </Node>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render clsed Node with child', () => {
    const tree = renderer
      .create(
        <Node {...folder}>
          <Node {...file} />
        </Node>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render Node as file with custom icon', () => {
    const tree = renderer.create(<Node {...file} Icon={Icon} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should click on file selecting it', () => {
    const service = {
      select: jest.fn()
    };
    const onClick = jest.fn();
    const wrapper = mount(
      <Node {...file} treeService={service} onLeafClick={onClick} />
    );
    const container = wrapper.find(`.nodeNameContainer`).first();
    expect(container.exists()).toBe(true);
    container.simulate('click');
    expect(service.select.mock.calls.length).toEqual(1);
    expect(onClick.mock.calls.length).toEqual(1);
  });

  test('should click on folder toggleOpen it', () => {
    const service = {
      toggleOpen: jest.fn()
    };
    const onClick = jest.fn();
    const wrapper = mount(
      <Node {...folder} treeService={service} onNodeClick={onClick} />
    );
    const container = wrapper.find(`.nodeNameContainer`).first();
    expect(container.exists()).toBe(true);
    container.simulate('click');
    expect(service.toggleOpen.mock.calls.length).toEqual(1);
    expect(onClick.mock.calls.length).toEqual(1);
  });
});
