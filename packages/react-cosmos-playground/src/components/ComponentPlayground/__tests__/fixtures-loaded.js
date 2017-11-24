import merge from 'lodash.merge';
import { createContext } from '../../../utils/enzyme';
import FixtureList from '../../FixtureList';
import WelcomeScreen from '../../screens/WelcomeScreen';
import fixture from '../__fixtures__/ready';

const goTo = jest.fn();

const { mount, getWrapper } = createContext({
  fixture: merge({}, fixture, {
    props: {
      router: {
        goTo
      }
    }
  })
});

describe('CP fixtures loaded', () => {
  beforeEach(mount);

  describe('fixture list', () => {
    let props;

    beforeEach(() => {
      props = getWrapper(FixtureList).props();
    });

    test('should render fixture list', () => {
      expect(getWrapper(FixtureList).length).toEqual(1);
    });

    test('should send fixtures to fixture list', () => {
      expect(props.fixtures).toEqual({
        ComponentA: ['foo', 'bar'],
        ComponentB: ['baz', 'qux']
      });
    });

    test('should send empty url params to fixture list', () => {
      expect(Object.keys(props.urlParams)).toEqual([]);
    });

    test('should go to URL from fixture list handler', () => {
      props.onUrlChange('/path/to/location');
      expect(goTo).toHaveBeenCalledWith('/path/to/location');
    });
  });

  describe('main menu', () => {
    test('should render home button', () => {
      expect(getWrapper('a[href="?"].button')).toHaveLength(1);
    });

    test('should render selected home button', () => {
      expect(getWrapper('a[href="?"].selectedButton')).toHaveLength(1);
    });
  });

  describe('welcome screen', () => {
    test('should render welcome screen', () => {
      expect(getWrapper(WelcomeScreen).length).toEqual(1);
    });

    test('should send fixtures to welcome screen', () => {
      expect(getWrapper(WelcomeScreen).prop('fixtures')).toEqual({
        ComponentA: ['foo', 'bar'],
        ComponentB: ['baz', 'qux']
      });
    });
  });
});
