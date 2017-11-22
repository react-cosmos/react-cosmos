import createFetchProxy from 'react-cosmos-fetch-proxy';
import { createContext } from '../../../utils/enzyme';
import StarryBg from '../../StarryBg';
import fixture from '../__fixtures__/init';

const FetchProxy = createFetchProxy();

const { mount, getWrapper } = createContext({
  proxies: [FetchProxy],
  fixture
});

describe('CP init', () => {
  beforeEach(mount);

  test('should starry background', () => {
    expect(getWrapper().find(StarryBg)).toHaveLength(1);
  });

  test('should render loader iframe', () => {
    expect(getWrapper().find('iframe')).toHaveLength(1);
  });

  test('should render loader iframe with props.loaderUri', () => {
    expect(
      getWrapper()
        .find('iframe')
        .prop('src')
    ).toBe('/mock/loader/index.html');
  });
});
