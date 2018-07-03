import { create as renderer } from 'react-test-renderer';
import createContext from 'react-cosmos-test/generic';
import fixture from '../__fixtures__/default';

const { mount, getWrapper } = createContext({ renderer, fixture });

describe('NativePendingScreen', () => {
  beforeEach(mount);

  it('renders correctly', () => {
    expect(getWrapper().toJSON()).toMatchSnapshot();
  });
});
