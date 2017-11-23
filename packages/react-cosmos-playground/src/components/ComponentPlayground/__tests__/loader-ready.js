import { createContext } from '../../../utils/enzyme';
import { READY } from '../';
import fixture from '../__fixtures__/ready';

const { mount, getCompInstance } = createContext({ fixture });

describe('CP loader ready', () => {
  beforeEach(mount);

  test('should set loaderStatus to READY', () => {
    expect(getCompInstance().state.loaderStatus).toBe(READY);
  });

  test('should add fixtures to state', () => {
    expect(getCompInstance().state.fixtures).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux']
    });
  });
});
