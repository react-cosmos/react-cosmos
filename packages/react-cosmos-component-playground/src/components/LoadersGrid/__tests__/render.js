import React from 'react';
import { Loader } from 'react-cosmos-loader';
import renderer from 'react-test-renderer';
import StarryBg from '../';
import blankFixture from '../__fixtures__/blank';

describe('StarryBg blank', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <Loader component={StarryBg} fixture={blankFixture} />
    );
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
