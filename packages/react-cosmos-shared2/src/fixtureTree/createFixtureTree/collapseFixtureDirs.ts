import { omit } from 'lodash';
import { FixtureTreeNode } from '../shared/types';

export function collapseFixtureDirs(
  treeNode: FixtureTreeNode,
  fixturesDir: string
): FixtureTreeNode {
  const { data, children } = treeNode;
  if (data.type !== 'fileDir' || !children) return treeNode;

  const collapsableDirNode = children[fixturesDir];
  if (collapsableDirNode && collapsableDirNode.data.type === 'fileDir') {
    const otherChildren = omit(children, fixturesDir);
    const innerChildren = collapsableDirNode.children;
    if (
      innerChildren &&
      // Make sure children of the collapsed dir don't overlap with children of
      // the parent dir
      Object.keys(otherChildren).every(childName => !innerChildren[childName])
    )
      return {
        data: { type: 'fileDir' },
        children: { ...otherChildren, ...innerChildren },
      };
  }

  return {
    ...treeNode,
    children: Object.keys(children).reduce(
      (newChildren, childName) => ({
        ...newChildren,
        [childName]: collapseFixtureDirs(children[childName], fixturesDir),
      }),
      {}
    ),
  };
}
