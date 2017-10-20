import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import MissingScreen from '../';
import missingFixture from '../__fixtures__/missing-fixture';

describe('MissingScreen', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(
      <Loader component={MissingScreen} fixture={missingFixture} />
    );
  });

  it('should render correct component name', () => {
    expect(wrapper.text()).toMatch(/Flatris/);
  });

  it('should render correct fixture name', () => {
    expect(wrapper.text()).toMatch(/WithState/);
  });
});
