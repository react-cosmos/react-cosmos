import { FixtureId } from '../renderer';
import { getSortedNodeDirNames } from './getSortedNodeDirNames';
import { TreeNode } from './shared/types';

export type FlatFixtureTreeItem = { fixtureId: FixtureId; cleanPath: string[] };
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
    flatFixtureTree.push({
      fixtureId: treeNode.items[itemName],
      cleanPath: [...parents, itemName],
    });
  });

  return flatFixtureTree;
}
