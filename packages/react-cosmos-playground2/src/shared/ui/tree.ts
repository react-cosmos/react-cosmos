import { TreeNode } from 'react-cosmos-shared2/fixtureTree';

export function hasDirs(rootNode: TreeNode<any>) {
  return getTreeDirNames(rootNode).length > 0;
}

export function getTreeDirNames(
  treeNode: TreeNode<any>,
  parentPath: string[] = []
) {
  const dirNames: string[] = [];

  const { dirs } = treeNode;
  Object.keys(dirs).forEach(dirName => {
    dirNames.push([...parentPath, dirName].join('/'));
    dirNames.push(...getTreeDirNames(dirs[dirName], [...parentPath, dirName]));
  });

  return dirNames;
}
