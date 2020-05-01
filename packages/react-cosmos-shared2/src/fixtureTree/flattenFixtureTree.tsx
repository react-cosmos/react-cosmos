import { FixtureId } from '../renderer';
import { getSortedNodeDirNames } from './getSortedNodeDirNames';
import { TreeNode } from './shared/types';

export type FlatFixtureTreeItem = {
  fileName: string;
  fixtureId: FixtureId;
  name: string | null;
  parents: string[];
};
export type FlatFixtureTree = FlatFixtureTreeItem[];

export function flattenFixtureTree(
  treeNode: TreeNode<FixtureId>,
  parents: string[] = []
): FlatFixtureTree {
  const flatFixtureTree: FlatFixtureTree = [];

  getSortedNodeDirNames(treeNode.dirs).forEach(dirName => {
    const dirNode = treeNode.dirs[dirName];
    flatFixtureTree.push(...flattenFixtureTree(dirNode, [...parents, dirName]));
  });

  Object.keys(treeNode.items).forEach(itemName => {
    const fixtureId = treeNode.items[itemName];
    if (fixtureId.name) {
      const newParents = [...parents];
      const fileName = newParents.pop();
      if (fileName)
        flatFixtureTree.push({
          fileName,
          fixtureId,
          parents: newParents,
          name: itemName,
        });
    } else {
      flatFixtureTree.push({
        fileName: itemName,
        fixtureId,
        parents,
        name: null,
      });
    }
  });

  return flatFixtureTree;
}
