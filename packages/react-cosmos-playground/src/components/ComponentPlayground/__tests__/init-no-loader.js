import { createContext } from '../../../utils/enzyme';
import StarryBg from '../../StarryBg';
import NoLoaderScreen from '../../screens/NoLoaderScreen';
import LoadingScreen from '../../screens/LoadingScreen';
import fixture from '../__fixtures__/init-no-loader';

const { mount, getWrapper } = createContext({ fixture });

describe('CP init', () => {
  test('renders loading screen', () => {
    // Purposely don't "await" on mount because by the time it finishes the
    // loading screen would have been removed
    mount();
    expect(getWrapper(LoadingScreen)).toHaveLength(1);
  });

  describe('after loader status is confirmed', () => {
    beforeEach(mount);

    test('should render starry background', () => {
      expect(getWrapper(StarryBg)).toHaveLength(1);
    });

    test('should render NoLoaderScreen', () => {
      expect(getWrapper(NoLoaderScreen)).toHaveLength(1);
    });

    test('should render NoLoaderScreen with options', () => {
      expect(getWrapper(NoLoaderScreen).prop('options')).toEqual(
        fixture.props.options
      );
    });
  });
});
