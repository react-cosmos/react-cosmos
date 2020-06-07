import { TreeNode } from 'react-cosmos-shared2/fixtureTree';

export function hasNonEmptyDirs(rootNode: TreeNode<any>) {
  return getNonEmptyTreeDirNames(rootNode).length > 0;
}

export function getNonEmptyTreeDirNames(
  treeNode: TreeNode<any>,
  parentPath: string[] = []
) {
  const dirNames: string[] = [];

  const { dirs } = treeNode;
  Object.keys(dirs).forEach(dirName => {
    const dirNode = dirs[dirName];
    if (!isTreeNodeEmpty(dirNode)) {
      dirNames.push([...parentPath, dirName].join('/'));
      dirNames.push(
        ...getNonEmptyTreeDirNames(dirNode, [...parentPath, dirName])
      );
    }
  });

  return dirNames;
}

function isTreeNodeEmpty(treeNode: TreeNode<any>) {
  const { dirs, items } = treeNode;
  return Object.keys(dirs).length === 0 && Object.keys(items).length === 0;
}
