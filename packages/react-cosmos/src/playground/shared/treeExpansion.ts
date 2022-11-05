import { TreeNode } from 'react-cosmos-core';

export type TreeExpansion = {
  [nodePath: string]: boolean;
};

export function isTreeFullyCollapsed(treeExpansion: TreeExpansion) {
  return Object.keys(treeExpansion).every(
    childPath => treeExpansion[childPath] === false
  );
}

export function getFullTreeExpansion(
  rootNode: TreeNode<any>
): Record<string, boolean> {
  const childPaths = getExpandableNodes(rootNode);
  return childPaths.reduce(
    (treeExpansion, dirName) => ({ ...treeExpansion, [dirName]: true }),
    {}
  );
}

export function hasExpandableNodes(rootNode: TreeNode<any>) {
  return getExpandableNodes(rootNode).length > 0;
}

function getExpandableNodes(treeNode: TreeNode<any>, parents: string[] = []) {
  const { children } = treeNode;
  if (!children) return [];

  const nodePaths: string[] = [];
  Object.keys(children).forEach(childName => {
    const childNode = children[childName];
    if (childNode.children && Object.keys(childNode.children).length > 0) {
      nodePaths.push([...parents, childName].join('/'));
      nodePaths.push(...getExpandableNodes(childNode, [...parents, childName]));
    }
  });

  return nodePaths;
}
