import { createContext } from '../../../utils/enzyme';
import FixtureList from '../../FixtureList';
import fixture from '../__fixtures__/selected-fullscreen';

const { mount, getWrapper } = createContext({ fixture });

describe('CP with fixture already selected in full screen', () => {
  beforeEach(mount);

  test('should not render fixture list', () => {
    expect(getWrapper(FixtureList).length).toEqual(0);
  });

  test('should render loader iframe', () => {
    expect(getWrapper('iframe')).toHaveLength(1);
  });
});
