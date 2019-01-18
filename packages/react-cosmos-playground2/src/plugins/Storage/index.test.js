// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../testHelpers/plugin';
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
  loadPlugins();

  const returnVal = await mockCall('storage.getItem', 'fooKey');
  expect(returnVal).toEqual('fooKeyValue');
});

it('sets item to localForage', async () => {
  register();
  loadPlugins();

  const returnVal = await mockCall('storage.setItem', 'fooKey', 'fooValue');
  expect(mockSetItem).toBeCalledWith('fooKey', 'fooValue');
  expect(returnVal).toEqual('setReturnValue');
});
