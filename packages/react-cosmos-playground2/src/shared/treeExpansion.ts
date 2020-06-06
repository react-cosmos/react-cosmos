import { TreeNode } from 'react-cosmos-shared2/fixtureTree';
import { getTreeDirNames } from './tree';
import { TreeExpansion } from './TreeView';

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
