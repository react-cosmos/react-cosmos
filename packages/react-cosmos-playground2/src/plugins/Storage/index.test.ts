import { loadPlugins } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../testHelpers/plugin';
import { StorageSpec } from './public';
import { register } from '.';

const mockSetItem = jest.fn();

jest.mock('localforage', () => ({
  getItem: (key: string) => Promise.resolve(`${key}Value`),
  setItem: (key: string, value: unknown) => {
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

  const { getItem } = getMethodsOf<StorageSpec>('storage');
  const returnVal = await getItem('fooKey');

  expect(returnVal).toEqual('fooKeyValue');
});

it('sets item to localForage', async () => {
  register();
  loadPlugins();

  const { setItem } = getMethodsOf<StorageSpec>('storage');
  const returnVal = await setItem('fooKey', 'fooValue');

  expect(mockSetItem).toBeCalledWith('fooKey', 'fooValue');
  expect(returnVal).toEqual('setReturnValue');
});
