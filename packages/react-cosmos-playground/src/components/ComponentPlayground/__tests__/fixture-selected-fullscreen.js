import createInitCallbackProxy from 'react-cosmos-loader/lib/components/InitCallbackProxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import { createContext } from '../../../utils/enzyme';
import FixtureList from '../../FixtureList';
import fixture from '../__fixtures__/selected-fullscreen';

const InitCallbackProxy = createInitCallbackProxy();
const FetchProxy = createFetchProxy();

const { mount, getWrapper } = createContext({
  proxies: [InitCallbackProxy, FetchProxy],
  fixture
});

describe('CP with fixture already selected in full screen', () => {
  beforeEach(mount);

  test('should not render fixture list', () => {
    expect(getWrapper(FixtureList).length).toEqual(0);
  });

  test('should render loader iframe', () => {
    expect(getWrapper('iframe')).toHaveLength(1);
  });
});
