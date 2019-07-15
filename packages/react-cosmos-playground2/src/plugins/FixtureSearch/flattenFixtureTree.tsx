import { FixtureId } from 'react-cosmos-shared2/renderer';
import { TreeNode } from '../../shared/ui/TreeView';

export type FixtureIdsByPath = Record<string, FixtureId>;

export function flattenFixtureTree(
  fixtureTree: TreeNode<FixtureId>,
  parents: string[] = []
): FixtureIdsByPath {
  const fixtureIds: FixtureIdsByPath = {};

  Object.keys(fixtureTree.items).forEach(itemName => {
    const cleanPath = [...parents, itemName].join(' ');
    fixtureIds[cleanPath] = fixtureTree.items[itemName];
  });

  Object.keys(fixtureTree.dirs).forEach(dirName => {
    const dir = fixtureTree.dirs[dirName];
    const dirFlatItems = flattenFixtureTree(dir, [...parents, dirName]);
    Object.keys(dirFlatItems).forEach(dirItemCleanPath => {
      fixtureIds[dirItemCleanPath] = dirFlatItems[dirItemCleanPath];
    });
  });

  return fixtureIds;
}
