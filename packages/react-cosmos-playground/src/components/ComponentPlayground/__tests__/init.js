import { createContext } from '../../../utils/enzyme';
import StarryBg from '../../StarryBg';
import fixture from '../__fixtures__/init';

const { mount, getWrapper } = createContext({ fixture });

describe('CP init', () => {
  beforeEach(mount);

  test('should starry background', () => {
    expect(getWrapper(StarryBg)).toHaveLength(1);
  });

  test('should render loader iframe', () => {
    expect(getWrapper('iframe')).toHaveLength(1);
  });

  test('should render loader iframe with props.loaderUri', () => {
    expect(getWrapper('iframe').prop('src')).toBe('/mock/loader/index.html');
  });
});
