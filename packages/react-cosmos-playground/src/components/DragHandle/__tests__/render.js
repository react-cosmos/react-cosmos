import { createContext } from 'react-cosmos-loader';
import { create as renderer } from 'react-test-renderer';
import horizontalFixture from '../__fixtures__/horizontal';
import verticalFixture from '../__fixtures__/vertical';

const nodeMock = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};
const createNodeMock = () => nodeMock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Horizontal DragHandle', () => {
  const { getWrapper, mount, unmount } = createContext({
    renderer,
    rendererOptions: { createNodeMock },
    fixture: horizontalFixture
  });

  beforeEach(mount);

  it('renders correctly', () => {
    expect(getWrapper().toJSON()).toMatchSnapshot();
  });

  it('calls addEventListener on mount', () => {
    expect(nodeMock.addEventListener).toHaveBeenCalled();
  });

  it('calls removeEventListener on unmount', () => {
    unmount();
    expect(nodeMock.removeEventListener).toHaveBeenCalled();
  });
});

describe('Vertical DragHandle', () => {
  const { getWrapper, mount, unmount } = createContext({
    renderer,
    rendererOptions: { createNodeMock },
    fixture: verticalFixture
  });

  beforeEach(mount);

  it('renders correctly', () => {
    expect(getWrapper().toJSON()).toMatchSnapshot();
  });

  it('calls addEventListener on mount', () => {
    expect(nodeMock.addEventListener).toHaveBeenCalled();
  });

  it('calls removeEventListener on unmount', () => {
    unmount();
    expect(nodeMock.removeEventListener).toHaveBeenCalled();
  });
});
