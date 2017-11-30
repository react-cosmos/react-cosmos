import { create as renderer } from 'react-test-renderer';
import createContext from 'react-cosmos-test/generic';
import customFixture from '../__fixtures__/custom-webpack-config';
import defaultFixture from '../__fixtures__/default-webpack-config';

describe('NoLoaderScreen custom webpack config', () => {
  const { mount, getWrapper } = createContext({
    renderer,
    fixture: customFixture
  });

  beforeEach(mount);

  it('renders correctly', () => {
    expect(getWrapper().toJSON()).toMatchSnapshot();
  });
});

describe('NoLoaderScreen default webpack config', () => {
  const { mount, getWrapper } = createContext({
    renderer,
    fixture: defaultFixture
  });

  beforeEach(mount);

  it('renders correctly', () => {
    expect(getWrapper().toJSON()).toMatchSnapshot();
  });
});
