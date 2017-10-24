import React from 'react';
import { Loader } from 'react-cosmos-loader';
import renderer from 'react-test-renderer';
import blankFixture from '../__fixtures__/blank';
import contentFixture from '../__fixtures__/content';

describe('StarryBg blank', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(<Loader fixture={blankFixture} />);
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe('StarryBg content', () => {
  let component;

  beforeEach(() => {
    component = renderer.create(<Loader fixture={contentFixture} />);
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
});
