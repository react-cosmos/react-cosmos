// @flow

import { getCosmosConfig } from 'react-cosmos-config';
import { createContext as createLoaderContext } from 'react-cosmos-loader';
import { getMock } from 'react-cosmos-flow/jest';
import { ProxyFoo, ProxyBar } from './__fsmocks__/cosmos.proxies';
import { createContext } from '../generic';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: jest.fn(() => ({
    proxiesPath: require.resolve('./__fsmocks__/cosmos.proxies')
  }))
}));

const mockWrapper = {};
const mockContext = {
  mount: jest.fn(),
  getWrapper: jest.fn(() => mockWrapper)
};

jest.mock('react-cosmos-loader', () => ({
  createContext: jest.fn(() => mockContext)
}));

const renderer = jest.fn();
const rendererOptions = {};
const fixture = { component: () => {} };

function getLastContextArgs() {
  return getMock(createLoaderContext).calls[0][0];
}

beforeEach(() => {
  jest.clearAllMocks();
});

it('sends renderer to generic createContext', () => {
  createContext({ renderer, fixture });

  expect(getLastContextArgs().renderer).toEqual(renderer);
});

it('sends renderer options to generic createContext', () => {
  createContext({ renderer, rendererOptions, fixture });

  expect(getLastContextArgs().rendererOptions).toEqual(rendererOptions);
});

it('forwards fixture to generic createContext', () => {
  createContext({ renderer, fixture });

  expect(getLastContextArgs().fixture).toEqual(fixture);
});

it('detects proxies from user config', () => {
  createContext({ renderer, fixture });

  expect(getLastContextArgs().proxies).toEqual([ProxyFoo, ProxyBar]);
});

it('prefers specified proxies', () => {
  const ProxyBaz = () => {};
  createContext({ renderer, fixture, proxies: [ProxyBaz] });

  expect(getLastContextArgs().proxies).toEqual([ProxyBaz]);
});

it('forwards custom config path', () => {
  createContext({ renderer, fixture, cosmosConfigPath: '/foo/path' });

  expect(getCosmosConfig).toHaveBeenCalledWith('/foo/path');
});
