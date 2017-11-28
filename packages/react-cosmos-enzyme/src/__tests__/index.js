// @flow

import { mount as mountEnzyme } from 'enzyme';
import { getCosmosConfig } from 'react-cosmos-config';
import { createContext as createGenericContext } from 'react-cosmos-loader';
import { ProxyFoo, ProxyBar } from './__fsmocks__/cosmos.proxies';
import { createContext } from '../';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: jest.fn(() => ({
    proxiesPath: require.resolve('./__fsmocks__/cosmos.proxies')
  }))
}));

const mockInnerChildWrapper = {};
const mockInnerWrapper = {
  find: jest.fn(() => mockInnerChildWrapper)
};
const mockWrapper = {
  update: jest.fn(),
  find: jest.fn(() => mockInnerWrapper)
};
const mockContext = {
  mount: jest.fn(),
  getWrapper: jest.fn(() => mockWrapper)
};

jest.mock('react-cosmos-loader', () => ({
  createContext: jest.fn(() => mockContext)
}));

const fixture = { component: () => {} };

function getLastContextArgs() {
  return createGenericContext.mock.calls[0][0];
}

beforeEach(() => {
  jest.clearAllMocks();
});

it('sends Enzyme renderer to generic createContext', () => {
  createContext({ fixture });

  expect(getLastContextArgs().renderer).toEqual(mountEnzyme);
});

it('forwards fixture to generic createContext', () => {
  createContext({ fixture });

  expect(getLastContextArgs().fixture).toEqual(fixture);
});

it('detects proxies from user config', () => {
  createContext({ fixture });

  expect(getLastContextArgs().proxies).toEqual([ProxyFoo, ProxyBar]);
});

it('prefers specified proxies', () => {
  const ProxyBaz = () => {};
  createContext({ fixture, proxies: [ProxyBaz] });

  expect(getLastContextArgs().proxies).toEqual([ProxyBaz]);
});

it('forwards custom config path', () => {
  createContext({ fixture, cosmosConfigPath: '/foo/path' });

  expect(getCosmosConfig).toHaveBeenCalledWith('/foo/path');
});

it('returns original wrapper via getRootWrapper', async () => {
  const { mount, getRootWrapper } = createContext({ fixture });
  await mount();

  expect(getRootWrapper()).toBe(mockWrapper);
});

it('calls wrapper.update on every getRootWrapper', async () => {
  const { mount, getRootWrapper } = createContext({ fixture });
  await mount();

  getRootWrapper();
  expect(mockWrapper.update).toHaveBeenCalled();
});

it('finds inner wrapper via getWrapper', async () => {
  const { mount, getWrapper } = createContext({ fixture });
  await mount();

  const w = getWrapper();
  expect(mockWrapper.find).toHaveBeenCalledWith(fixture.component);
  expect(w).toBe(mockInnerWrapper);
});

it('finds child inner wrapper via getWrapper with selector', async () => {
  const { mount, getWrapper } = createContext({ fixture });
  await mount();

  const w = getWrapper('.class');
  expect(mockWrapper.find).toHaveBeenCalledWith(fixture.component);
  expect(mockInnerWrapper.find).toHaveBeenCalledWith('.class');
  expect(w).toBe(mockInnerChildWrapper);
});
