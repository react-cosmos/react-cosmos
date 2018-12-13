// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockInitCall } from '../../testHelpers/plugin';
import { register } from '.';

const mockSetItem = jest.fn();

jest.mock('localforage', () => ({
  getItem: key => Promise.resolve(`${key}Value`),
  setItem: (key, value) => {
    mockSetItem(key, value);
    return Promise.resolve('setReturnValue');
  }
}));

afterEach(() => {
  cleanup();
  mockSetItem.mockClear();
});

it('gets item from localForage', async () => {
  register();

  const callReturn = mockInitCall('storage.getItem', 'fooKey');
  loadPlugins();

  expect(await callReturn).toEqual('fooKeyValue');
});

it('sets item to localForage', async () => {
  register();

  const callReturn = mockInitCall('storage.setItem', 'fooKey', 'fooValue');
  loadPlugins();

  expect(mockSetItem).toBeCalledWith('fooKey', 'fooValue');
  expect(await callReturn).toEqual('setReturnValue');
});
