import React from 'react';
import { mount } from 'enzyme';
import afterOngoingPromises from 'after-ongoing-promises';
import { Loader } from 'react-cosmos-loader';
import initFixture from '../__fixtures__/init';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import StarryBg from '../../StarryBg';

const FetchProxy = createFetchProxy();

describe('CP init', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(<Loader proxies={[FetchProxy]} fixture={initFixture} />);
    // Wait for Loader status to be confirmed
    await afterOngoingPromises();
    wrapper.update();
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
