import { TreeNode } from 'react-cosmos-shared2/fixtureTree';
import { getNonEmptyTreeDirNames } from './tree';
import { TreeExpansion } from './TreeView';

export function isTreeFullyCollapsed(treeExpansion: TreeExpansion) {
  return Object.keys(treeExpansion).every(
    dirName => treeExpansion[dirName] === false
  );
}

export function getFullTreeExpansion(
  rootNode: TreeNode<any>
): Record<string, boolean> {
  const dirNames = getNonEmptyTreeDirNames(rootNode);
  return dirNames.reduce(
    (treeExpansion, dirName) => ({ ...treeExpansion, [dirName]: true }),
    {}
  );
}
