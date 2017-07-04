import React from 'react';
import { Loader } from 'react-cosmos-loader';
import renderer from 'react-test-renderer';
import ComponentPage from '../';
import blankFixture from '../__fixtures__/blank';

describe('ComponentPage blank', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <Loader component={ComponentPage} fixture={blankFixture} />
    );
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
