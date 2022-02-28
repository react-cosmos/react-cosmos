import { FixtureTreeSpec, StorageSpec } from 'react-cosmos-shared2/ui';
import { PluginContext } from 'react-plugin';
import { TreeExpansion } from '../../shared/treeExpansion';

export type FixtureTreeContext = PluginContext<FixtureTreeSpec>;

const TREE_EXPANSION_STORAGE_KEY = 'fixtureTreeExpansion';

const DEFAULT_TREE_EXPANSION = {};

export function getTreeExpansion({ getItem }: StorageSpec['methods']) {
  return (
    getItem<TreeExpansion>(TREE_EXPANSION_STORAGE_KEY) || DEFAULT_TREE_EXPANSION
  );
}

export function setTreeExpansion(
  { setItem }: StorageSpec['methods'],
  treeExpansion: TreeExpansion
) {
  setItem(TREE_EXPANSION_STORAGE_KEY, treeExpansion);
}
