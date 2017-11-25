// @flow

import { createContext } from '../';
import { Loader } from 'react-cosmos-loader';

jest.mock('react-cosmos-loader/lib/components/RefCallbackProxy', () =>
  jest.fn(() => ({ MOCK_REFCB_PROXY: true }))
);

const compRef = {};
const wrapper = {
  unmount: jest.fn()
};
const renderer = jest.fn(() => {
  try {
    const element = renderer.mock.calls[0][0];
    element.props.onComponentRef(compRef);
  } catch (err) {
    throw new Error('Loader could not call onComponentRef prop');
  }

  return wrapper;
});
const proxies = [() => {}, () => {}];
const fixture = {};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('mounting', () => {
  beforeEach(async () => {
    const { mount } = createContext({ renderer, proxies, fixture });
    await mount();
  });

  it('calls renderer on mount', () => {
    expect(renderer).toHaveBeenCalled();
  });

  it('calls renderer with Loader element', () => {
    const element = renderer.mock.calls[0][0];
    expect(element.type).toBe(Loader);
  });

  describe('Loader props', () => {
    it('has fixture', () => {
      const element = renderer.mock.calls[0][0];
      expect(element.props.fixture).toBe(fixture);
    });

    it('includes user proxies', () => {
      const element = renderer.mock.calls[0][0];
      expect(element.props.proxies).toContain(proxies[0]);
      expect(element.props.proxies).toContain(proxies[1]);
    });

    it('prepends RefCallbackProxy', () => {
      const element = renderer.mock.calls[0][0];
      expect(element.props.proxies[0].MOCK_REFCB_PROXY).toBe(true);
    });
  });
});

describe('unmounting', () => {
  beforeEach(async () => {
    const { mount, unmount } = createContext({ renderer, fixture });
    await mount();
    await unmount();
  });

  it('calls wrapper.unmount', () => {
    expect(wrapper.unmount).toHaveBeenCalled();
  });
});

it('returns component ref', async () => {
  const { mount, getRef } = createContext({ renderer, fixture });
  await mount();

  expect(getRef()).toBe(compRef);
});

it('returns wrapper', async () => {
  const { mount, getWrapper } = createContext({ renderer, fixture });
  await mount();

  expect(getWrapper()).toBe(wrapper);
});
