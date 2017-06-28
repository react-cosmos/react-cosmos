import React from 'react';
import { Loader } from 'react-cosmos-loader';
import renderer from 'react-test-renderer';
import DragHandle from '../';
import horizontalFixture from '../__fixtures__/horizontal';
import verticalFixture from '../__fixtures__/vertical';

let nodeMock;
let component;

const createNodeMock = () => nodeMock;

beforeEach(() => {
  nodeMock = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
});

describe('Horizontal DragHandle', () => {
  beforeEach(() => {
    const options = { createNodeMock };
    component = renderer.create(
      <Loader component={DragHandle} fixture={horizontalFixture} />,
      options
    );
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('calls addEventListener on mount', () => {
    expect(nodeMock.addEventListener).toHaveBeenCalled();
  });

  it('calls removeEventListener on unmount', () => {
    component.unmount();
    expect(nodeMock.removeEventListener).toHaveBeenCalled();
  });
});

describe('Vertical DragHandle', () => {
  beforeEach(() => {
    const options = { createNodeMock };
    component = renderer.create(
      <Loader component={DragHandle} fixture={verticalFixture} />,
      options
    );
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('calls addEventListener on mount', () => {
    expect(nodeMock.addEventListener).toHaveBeenCalled();
  });

  it('calls removeEventListener on unmount', () => {
    component.unmount();
    expect(nodeMock.removeEventListener).toHaveBeenCalled();
  });
});
