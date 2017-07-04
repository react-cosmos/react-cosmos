import React from 'react';
import { Loader } from 'react-cosmos-loader';
import renderer from 'react-test-renderer';
import LoaderGrid from '../';
import blankFixture from '../__fixtures__/blank';

describe('LoaderGrid blank', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(
      <Loader component={LoaderGrid} fixture={blankFixture} />
    );
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
