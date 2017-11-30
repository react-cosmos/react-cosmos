import { create as renderer } from 'react-test-renderer';
import { createContext } from 'react-cosmos-loader';
import blankFixture from '../__fixtures__/blank';
import contentFixture from '../__fixtures__/content';

describe('StarryBg blank', () => {
  const { mount, getWrapper } = createContext({
    renderer,
    fixture: blankFixture
  });

  beforeEach(mount);

  it('renders correctly', () => {
    expect(getWrapper().toJSON()).toMatchSnapshot();
  });
});

describe('StarryBg content', () => {
  const { mount, getWrapper } = createContext({
    renderer,
    fixture: contentFixture
  });

  beforeEach(mount);

  it('renders correctly', () => {
    expect(getWrapper().toJSON()).toMatchSnapshot();
  });
});
