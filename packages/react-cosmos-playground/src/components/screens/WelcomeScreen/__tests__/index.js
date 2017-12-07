import { createContext } from '../../../../utils/enzyme';
import noComponents from '../__fixtures__/no-components';
import componentsWithFixtures from '../__fixtures__/components-with-fixtures';

describe('WelcomeScreen', () => {
  describe('for users without fixtures and components', () => {
    const { mount, getWrapper } = createContext({
      fixture: noComponents
    });

    beforeEach(mount);

    it('should render title', () => {
      expect(getWrapper().text()).toMatch(/Congratulations/);
    });

    it('should render text', () => {
      expect(getWrapper().text()).toMatch(/Create your first fixture/);
    });
  });

  describe('for users with components and fixtures', () => {
    const { mount, getWrapper } = createContext({
      fixture: componentsWithFixtures
    });

    beforeEach(mount);

    it('should render title', () => {
      expect(getWrapper().text()).toMatch(/You're all set/);
    });

    it('should render text', () => {
      expect(getWrapper().text()).toMatch(/Be a part of React Cosmos/);
    });
  });
});
