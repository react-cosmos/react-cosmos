import createFetchProxy from 'react-cosmos-fetch-proxy';
import { createContext } from '../../../utils/enzyme';
import StarryBg from '../../StarryBg';
import NoLoaderScreen from '../../screens/NoLoaderScreen';
import LoadingScreen from '../../screens/LoadingScreen';
import fixture from '../__fixtures__/init-no-loader';

const FetchProxy = createFetchProxy();

const { mount, getWrapper } = createContext({
  proxies: [FetchProxy],
  fixture
});

const getNoLoaderScreen = () => getWrapper().find(NoLoaderScreen);

describe('CP init', () => {
  test('renders loading screen', () => {
    // Purposely don't "await" on mount because by the time it finishes the
    // loading screen would have been removed
    mount();
    expect(getWrapper().find(LoadingScreen)).toHaveLength(1);
  });

  describe('after loader status is confirmed', () => {
    beforeEach(mount);

    test('should render starry background', () => {
      expect(getWrapper().find(StarryBg)).toHaveLength(1);
    });

    test('should render NoLoaderScreen', () => {
      expect(getNoLoaderScreen()).toHaveLength(1);
    });

    test('should render NoLoaderScreen with options', () => {
      expect(getNoLoaderScreen().prop('options')).toEqual(
        fixture.props.options
      );
    });
  });
});
