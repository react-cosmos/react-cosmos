import createInitCallbackProxy from 'react-cosmos-loader/lib/components/InitCallbackProxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import { createContext, afterPendingTimers } from '../../../utils/enzyme';
import FixtureList from '../../FixtureList';
import WelcomeScreen from '../../screens/WelcomeScreen';
import fixture from '../__fixtures__/ready';

const InitCallbackProxy = createInitCallbackProxy();
const FetchProxy = createFetchProxy();

const { mount, getWrapper } = createContext({
  proxies: [InitCallbackProxy, FetchProxy],
  fixture
});

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
    expect(
      getWrapper()
        .find(FixtureList)
        .prop('fixtures')
    ).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux', 'quux']
    });
  });

  test('should send fixtures to welcome screen', () => {
    expect(
      getWrapper()
        .find(WelcomeScreen)
        .prop('fixtures')
    ).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux', 'quux']
    });
  });
});
