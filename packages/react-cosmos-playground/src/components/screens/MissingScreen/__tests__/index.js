import { createContext } from '../../../../utils/enzyme';
import fixture from '../__fixtures__/missing-fixture';

const { mount, getWrapper } = createContext({ fixture });

describe('MissingScreen', () => {
  beforeEach(mount);

  it('should render correct component name', () => {
    expect(getWrapper().text()).toMatch(/Flatris/);
  });

  it('should render correct fixture name', () => {
    expect(getWrapper().text()).toMatch(/WithState/);
  });
});
