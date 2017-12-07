import { createContext } from '../../../../utils/enzyme';
import fixture from '../__fixtures__/hi-there';

const { mount, getWrapper } = createContext({ fixture });

describe('DisplayScreen', () => {
  beforeEach(mount);

  it('should render children', () => {
    expect(getWrapper().text()).toMatch(/Hi there/);
  });
});
