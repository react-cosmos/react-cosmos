import { loadPlugins } from 'react-plugin';
import retry from '@skidding/async-retry';
import { cleanup, getMethodsOf } from '../../testHelpers/plugin';
import { StorageSpec } from './public';
import { register } from '.';

const mockSetItem = jest.fn();

jest.mock('localforage', () => {
  const storageMock: { [key: string]: object } = {
    'cosmos-fooProjectId': { fooKey: 'fooValue' }
  };
  return {
    getItem: (projectId: string) => Promise.resolve(storageMock[projectId]),
    setItem: async (projectId: string, value: unknown) => {
      await Promise.resolve();
      mockSetItem(projectId, value);
    }
  };
});

beforeEach(() => {
  register();
  loadPlugins();
});

afterEach(() => {
  cleanup();
  mockSetItem.mockClear();
});

function getStorageMethods() {
  return getMethodsOf<StorageSpec>('storage');
}

it('loads item from localForage', async () => {
  const { loadCache, getItem } = getStorageMethods();
  await loadCache('fooProjectId');
  expect(getItem('fooKey')).toEqual('fooValue');
});

it('sets item to localForage', async () => {
  const { loadCache, setItem } = getStorageMethods();
  await loadCache('fooProjectId');
  setItem('barKey', 'barValue');
  await retry(() =>
    expect(mockSetItem).toBeCalledWith('cosmos-fooProjectId', {
      fooKey: 'fooValue',
      barKey: 'barValue'
    })
  );
});

it('sets item to local cache', async () => {
  const { loadCache, getItem, setItem } = getStorageMethods();
  await loadCache('fooProjectId');
  setItem('barKey', 'barValue');
  expect(getItem('barKey')).toBe('barValue');
});

it('fails getting if cache is not loaded', () => {
  const { getItem } = getStorageMethods();
  expect(() => getItem('barKey')).toThrow(
    `Can't retrieve item "barKey" before loading storage`
  );
});

it('fails setting if cache is not loaded', () => {
  const { setItem } = getStorageMethods();
  expect(() => setItem('barKey', 'barValue')).toThrow(
    `Can't set item "barKey" before loading storage`
  );
});
