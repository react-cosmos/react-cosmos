import React from 'react';
import { Loader } from 'react-cosmos-loader';
import renderer from 'react-test-renderer';
import customFixture from '../__fixtures__/custom-webpack-config';
import defaultFixture from '../__fixtures__/default-webpack-config';

describe('NoLoaderScreen custom webpack config', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(<Loader fixture={customFixture} />);
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe('NoLoaderScreen default webpack config', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(<Loader fixture={defaultFixture} />);
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
