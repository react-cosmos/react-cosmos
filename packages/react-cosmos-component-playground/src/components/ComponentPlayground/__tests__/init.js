import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import initFixture from '../__fixtures__/init';
import StarryBg from '../../StarryBg';
import ComponentPlayground from '../';

const shallowLoader = element =>
  shallow(element)
    .dive() // Loader
    .dive(); // PropsProxy

describe('CP init', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowLoader(
      <Loader component={ComponentPlayground} fixture={initFixture} />
    );
  });

  test('should starry background', () => {
    expect(wrapper.find(StarryBg)).toHaveLength(1);
  });

  test('should render loader iframe', () => {
    expect(wrapper.find('iframe')).toHaveLength(1);
  });

  test('should render loader iframe with props.loaderUri', () => {
    expect(wrapper.find('iframe').prop('src')).toBe('/mock/loader/index.html');
  });
});
