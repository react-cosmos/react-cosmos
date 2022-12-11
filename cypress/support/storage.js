import localForage from 'localforage';

const STORAGE_KEY = `react-cosmos`;

export function clearStorage() {
  return localForage.removeItem(STORAGE_KEY);
}
