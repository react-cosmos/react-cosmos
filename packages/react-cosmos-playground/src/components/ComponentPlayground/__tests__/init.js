import until from 'async-until';
import { createContext } from '../../../utils/enzyme';
import StarryBg from '../../StarryBg';
import fixture from '../__fixtures__/init';

const { mount, getWrapper, getRef } = createContext({ fixture });

describe('CP init', () => {
  beforeEach(async () => {
    await mount();
    await until(() => getRef().state.loaderStatus === 'WEB_INDEX_OK');
  });

  test('should starry background', () => {
    expect(getWrapper(StarryBg)).toHaveLength(1);
  });

  test('should render loader iframe', () => {
    expect(getWrapper('iframe')).toHaveLength(1);
  });

  test('should render loader iframe with props.loaderUri', () => {
    expect(getWrapper('iframe').prop('src')).toBe('/_loader-mock.html');
  });
});
