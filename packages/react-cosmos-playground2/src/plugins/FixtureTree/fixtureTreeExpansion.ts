import { TreeNode } from 'react-cosmos-shared2/fixtureTree';
import { TreeExpansion } from '../../shared/ui/TreeView';

export function isFullyCollapsed(treeExpansion: TreeExpansion) {
  return Object.keys(treeExpansion).every(
    dirName => treeExpansion[dirName] === false
  );
}

export function getFullTreeExpansion(
  rootNode: TreeNode<any>
): Record<string, boolean> {
  const dirNames = getTreeDirNames(rootNode);
  return dirNames.reduce(
    (treeExpansion, dirName) => ({ ...treeExpansion, [dirName]: true }),
    {}
  );
}

export function hasDirs(rootNode: TreeNode<any>) {
  return getTreeDirNames(rootNode).length > 0;
}

function getTreeDirNames(treeNode: TreeNode<any>, parentPath: string[] = []) {
  const dirNames: string[] = [];

  const { dirs } = treeNode;
  Object.keys(dirs).forEach(dirName => {
    dirNames.push([...parentPath, dirName].join('/'));
    dirNames.push(...getTreeDirNames(dirs[dirName], [...parentPath, dirName]));
  });

  return dirNames;
}
