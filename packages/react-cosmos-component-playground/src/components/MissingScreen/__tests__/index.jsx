import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import MissingScreen from '../';
import missingFixture from '../__fixtures__/missing-fixture';

const shallowLoader = element =>
  shallow(element)
    .dive() // Loader
    .dive(); // PropsProxy

describe('MissingScreen', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallowLoader(
      <Loader component={MissingScreen} fixture={missingFixture} />
    ).dive();
  });

  it('should render correct component name', () => {
    expect(wrapper.text()).toMatch(/Flatris/);
  });

  it('should render correct fixture name', () => {
    expect(wrapper.text()).toMatch(/WithState/);
  });
});
