import localForage from 'localforage';

const EXAMPLE_PATH = '/Users/ovidiu/Work/@react-cosmos/react-cosmos/example';
const TREE_VIEW_STORAGE_KEY = `cosmos-treeExpansion-${EXAMPLE_PATH}`;

export function clearTreeViewState() {
  return localForage.removeItem(TREE_VIEW_STORAGE_KEY);
}
