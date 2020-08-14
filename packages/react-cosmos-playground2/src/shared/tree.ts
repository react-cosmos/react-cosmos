import { TreeNode } from 'react-cosmos-shared2/util';

export function hasNonEmptyDirs(rootNode: TreeNode<any>) {
  return getNonEmptyTreeDirNames(rootNode).length > 0;
}

export function getNonEmptyTreeDirNames(
  treeNode: TreeNode<any>,
  parents: string[] = []
) {
  const dirNames: string[] = [];

  const { children } = treeNode;
  if (children)
    Object.keys(children).forEach(childName => {
      const childNode = children[childName];
      if (childNode.children && Object.keys(childNode.children).length > 0) {
        dirNames.push([...parents, childName].join('/'));
        dirNames.push(
          ...getNonEmptyTreeDirNames(childNode, [...parents, childName])
        );
      }
    });

  return dirNames;
}
