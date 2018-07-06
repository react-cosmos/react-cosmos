import { createContext } from '../../../utils/enzyme';
import StarryBg from '../../StarryBg';
import WebIndexErrorScreen from '../../screens/WebIndexErrorScreen';
import WebBundlingScreen from '../../screens/WebBundlingScreen';
import fixture from '../__fixtures__/init-no-loader';

const { mount, getWrapper } = createContext({ fixture });

describe('CP init', () => {
  test('renders loading screen', () => {
    // Purposely don't "await" on mount because by the time it finishes the
    // loading screen would have been removed
    mount();
    expect(getWrapper(WebBundlingScreen)).toHaveLength(1);
  });

  describe('after loader status is confirmed', () => {
    beforeEach(mount);

    test('should render starry background', () => {
      expect(getWrapper(StarryBg)).toHaveLength(1);
    });

    test('should render WebIndexErrorScreen', () => {
      expect(getWrapper(WebIndexErrorScreen)).toHaveLength(1);
    });

    test('should render WebIndexErrorScreen with options', () => {
      expect(getWrapper(WebIndexErrorScreen).prop('options')).toEqual(
        fixture.props.options
      );
    });
  });
});
