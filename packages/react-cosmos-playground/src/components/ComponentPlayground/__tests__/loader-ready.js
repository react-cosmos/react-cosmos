import { createContext } from '../../../utils/enzyme';
import { READY } from '..';
import fixture from '../__fixtures__/ready';

const { mount, getRef } = createContext({ fixture });

describe('CP loader ready', () => {
  beforeEach(mount);

  test('should set loaderStatus to READY', () => {
    expect(getRef().state.loaderStatus).toBe(READY);
  });

  test('should add fixtures to state', () => {
    expect(getRef().state.fixtures).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux']
    });
  });
});
