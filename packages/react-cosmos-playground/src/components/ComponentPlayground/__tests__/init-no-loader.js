import React from 'react';
import { mount } from 'enzyme';
import afterOngoingPromises from 'after-ongoing-promises';
import { Loader } from 'react-cosmos-loader';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import initNoLoaderFixture from '../__fixtures__/init-no-loader';
import StarryBg from '../../StarryBg';
import NoLoaderScreen from '../../screens/NoLoaderScreen';

const FetchProxy = createFetchProxy();

describe('CP init', () => {
  let wrapper;

  const getNoLoaderScreen = () => wrapper.find(NoLoaderScreen);

  beforeEach(async () => {
    wrapper = mount(
      <Loader proxies={[FetchProxy]} fixture={initNoLoaderFixture} />
    );
    await afterOngoingPromises();
    wrapper.update();
  });

  test('should starry background', () => {
    expect(wrapper.find(StarryBg)).toHaveLength(1);
  });

  test('should render NoLoaderScreen', () => {
    expect(getNoLoaderScreen()).toHaveLength(1);
  });

  test('should render NoLoaderScreen with options', () => {
    expect(getNoLoaderScreen().prop('options')).toEqual(
      initNoLoaderFixture.props.options
    );
  });
});
