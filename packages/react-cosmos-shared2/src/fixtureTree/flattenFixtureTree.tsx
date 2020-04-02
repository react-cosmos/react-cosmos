import { FixtureId } from '../renderer';
import { getSortedNodeDirNames } from './getSortedNodeDirNames';
import { TreeNode } from './shared/types';

export type FixtureIdsByPath = Record<string, FixtureId>;

export function flattenFixtureTree(
  fixtureTree: TreeNode<FixtureId>,
  parents: string[] = []
): FixtureIdsByPath {
  const fixtureIds: FixtureIdsByPath = {};

  getSortedNodeDirNames(fixtureTree.dirs).forEach(dirName => {
    const dir = fixtureTree.dirs[dirName];
    const dirFlatItems = flattenFixtureTree(dir, [...parents, dirName]);
    Object.keys(dirFlatItems).forEach(dirItemCleanPath => {
      fixtureIds[dirItemCleanPath] = dirFlatItems[dirItemCleanPath];
    });
  });

  Object.keys(fixtureTree.items).forEach(itemName => {
    // TODO: Allow customization of parents & itemName
    const cleanPath = [...parents, itemName].join(' ');
    fixtureIds[cleanPath] = fixtureTree.items[itemName];
  });

  return fixtureIds;
}
