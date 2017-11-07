import React from 'react';
import { mount } from 'enzyme';
import afterOngoingPromises from 'after-ongoing-promises';
import { Loader } from 'react-cosmos-loader';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import initNoLoaderFixture from '../__fixtures__/init-no-loader';
import StarryBg from '../../StarryBg';
import NoLoaderScreen from '../../screens/NoLoaderScreen';
import LoadingScreen from '../../screens/LoadingScreen';

const FetchProxy = createFetchProxy();

describe('CP init', () => {
  let wrapper;

  const getNoLoaderScreen = () => wrapper.find(NoLoaderScreen);

  beforeEach(() => {
    wrapper = mount(
      <Loader proxies={[FetchProxy]} fixture={initNoLoaderFixture} />
    );
  });

  test('renders loading screen', () => {
    expect(wrapper.find(LoadingScreen)).toHaveLength(1);
  });

  describe('after loader status is confirmed', () => {
    beforeEach(async () => {
      await afterOngoingPromises();
      wrapper.update();
    });

    test('should render starry background', () => {
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
});
