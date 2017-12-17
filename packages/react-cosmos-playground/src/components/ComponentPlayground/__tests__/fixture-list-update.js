import afterPendingTimers from 'after-pending-timers';
import { createContext } from '../../../utils/enzyme';
import FixtureList from '../../FixtureList';
import WelcomeScreen from '../../screens/WelcomeScreen';
import fixture from '../__fixtures__/ready';

const { mount, getWrapper } = createContext({ fixture });

describe('CP fixture list update', () => {
  beforeEach(async () => {
    await mount();

    window.postMessage(
      {
        type: 'fixtureListUpdate',
        fixtures: {
          ComponentA: ['foo', 'bar'],
          ComponentB: ['baz', 'qux', 'quux']
        }
      },
      '*'
    );

    // postMessage is async, but should be received by next loop
    await afterPendingTimers();
  });

  test('should send fixtures to fixture list', () => {
    expect(getWrapper(FixtureList).prop('fixtures')).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux', 'quux']
    });
  });

  test('should send fixtures to welcome screen', () => {
    expect(getWrapper(WelcomeScreen).prop('fixtures')).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux', 'quux']
    });
  });
});
