import React from 'react';
import { Loader } from 'react-cosmos-loader';
import renderer from 'react-test-renderer';
import defaultFixture from '../__fixtures__/default';

describe('LoadingScreen', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(<Loader fixture={defaultFixture} />);
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
