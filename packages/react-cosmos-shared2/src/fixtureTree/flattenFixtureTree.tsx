import { FixtureId } from '../renderer';
import { getSortedNodeDirNames } from './getSortedNodeDirNames';
import { FixtureNode } from './shared/types';

export type FlatFixtureTreeItem = {
  fileName: string;
  fixtureId: FixtureId;
  name: string | null;
  parents: string[];
};
export type FlatFixtureTree = FlatFixtureTreeItem[];

export function flattenFixtureTree(
  treeNode: FixtureNode,
  parents: string[] = []
): FlatFixtureTree {
  const flatFixtureTree: FlatFixtureTree = [];

  getSortedNodeDirNames(treeNode.dirs).forEach(dirName => {
    const dirNode = treeNode.dirs[dirName];
    flatFixtureTree.push(...flattenFixtureTree(dirNode, [...parents, dirName]));
  });

  Object.keys(treeNode.items).forEach(itemName => {
    const { fixturePath, fixtureNames } = treeNode.items[itemName];

    if (fixtureNames)
      fixtureNames.forEach(fixtureName =>
        flatFixtureTree.push({
          fileName: itemName,
          fixtureId: { path: fixturePath, name: fixtureName },
          parents,
          name: fixtureName,
        })
      );
    else
      flatFixtureTree.push({
        fileName: itemName,
        fixtureId: { path: fixturePath, name: null },
        parents,
        name: null,
      });
  });

  return flatFixtureTree;
}
