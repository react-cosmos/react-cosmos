import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import hiThereFixture from '../__fixtures__/hi-there';

describe('DisplayScreen', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Loader fixture={hiThereFixture} />);
  });

  it('should render children', () => {
    expect(wrapper.text()).toMatch(/Hi there/);
  });
});
