import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import DisplayScreen from '../';
import hiThereFixture from '../__fixtures__/hi-there';

const shallowLoader = element =>
  shallow(element)
    .dive() // Loader
    .dive(); // PropsProxy

describe('DisplayScreen', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallowLoader(
      <Loader component={DisplayScreen} fixture={hiThereFixture} />
    );
  });

  it('should render children', () => {
    expect(wrapper.text()).toMatch(/Hi there/);
  });
});
