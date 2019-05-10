import localForage from 'localforage';

const EXAMPLE_PATH = '/Users/ovidiu/Work/@react-cosmos/react-cosmos/example';
const STORAGE_KEY = `cosmos-${EXAMPLE_PATH}`;

export function clearStorage() {
  return localForage.removeItem(STORAGE_KEY);
}
