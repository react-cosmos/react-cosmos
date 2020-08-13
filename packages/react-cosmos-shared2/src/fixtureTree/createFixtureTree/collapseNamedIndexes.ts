import { FixtureTreeNode } from '../shared/types';

export function collapseNamedIndexes(
  treeNode: FixtureTreeNode
): FixtureTreeNode {
  const { data, children } = treeNode;
  if (data.type !== 'fileDir' || !children) return treeNode;

  return {
    ...treeNode,
    children: Object.keys(children).reduce((newChildren, childName) => {
      const childNode = children[childName];
      const next = () => ({
        ...newChildren,
        [childName]: collapseNamedIndexes(childNode),
      });

      const grandchildrenNode = childNode.children;
      if (childNode.data.type !== 'fileDir' || !grandchildrenNode)
        return next();

      const grandchildNames = Object.keys(grandchildrenNode);
      if (grandchildNames.length !== 1) return next();

      const [firstGrandchildName] = grandchildNames;
      const firstGrandchildNode = grandchildrenNode[firstGrandchildName];
      if (
        firstGrandchildNode.data.type !== 'fileDir' &&
        noCaseEqual(childName, firstGrandchildName)
      )
        return { ...newChildren, [firstGrandchildName]: firstGrandchildNode };

      return next();
    }, {}),
  };
}

function noCaseEqual(a: string, b: string) {
  return a.toUpperCase() === b.toUpperCase();
}
