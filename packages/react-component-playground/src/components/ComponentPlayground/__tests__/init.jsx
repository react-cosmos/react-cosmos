import React from 'react';
import { shallow } from 'enzyme';
import StarryBg from '../../StarryBg';
import ComponentPlayground from '../';

describe('CP init', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <ComponentPlayground
        loaderUri="/loader/index.html"
        router={{}}
      />
    );
  });

  test('should starry background', () => {
    expect(wrapper.find(StarryBg).length).toBe(1);
  });

  test('should render loader iframe', () => {
    expect(wrapper.find('iframe').length).toBe(1);
  });

  test('should render loader iframe with props.loaderUri', () => {
    expect(wrapper.find('iframe').prop('src')).toBe('/loader/index.html');
  });
});
