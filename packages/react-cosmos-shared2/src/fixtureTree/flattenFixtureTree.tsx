import { FixtureId } from '../renderer';
import { getSortedTreeChildNames } from '../util';
import { FixtureTreeNode } from './shared/types';

export type FlatFixtureTreeItem = {
  fileName: string;
  fixtureId: FixtureId;
  name: string | null;
  parents: string[];
};
export type FlatFixtureTree = FlatFixtureTreeItem[];

export function flattenFixtureTree(
  treeNode: FixtureTreeNode,
  parents: string[] = []
): FlatFixtureTree {
  const { data, children } = treeNode;
  if (data.type === 'fixture' || !children) return [];

  const flatFixtureTree: FlatFixtureTree = [];
  getSortedTreeChildNames(treeNode).forEach(childName => {
    const childNode = children[childName];

    if (childNode.data.type === 'fileDir')
      flatFixtureTree.push(
        ...flattenFixtureTree(childNode, [...parents, childName])
      );

    if (childNode.data.type === 'multiFixture') {
      const { fixtureIds } = childNode.data;
      Object.keys(fixtureIds).forEach(fixtureName =>
        flatFixtureTree.push({
          fileName: childName,
          fixtureId: fixtureIds[fixtureName],
          parents,
          name: fixtureName,
        })
      );
    }

    if (childNode.data.type === 'fixture')
      flatFixtureTree.push({
        fileName: childName,
        fixtureId: childNode.data.fixtureId,
        parents,
        name: null,
      });
  });

  return flatFixtureTree;
}
