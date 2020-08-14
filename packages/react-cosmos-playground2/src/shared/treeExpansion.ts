import { useCallback } from 'react';
import { TreeNode } from 'react-cosmos-shared2/util';
import { getNonEmptyTreeDirNames } from './tree';

export type TreeExpansion = {
  [nodePath: string]: boolean;
};

export type OnTreeExpansionToggle = (
  parents: string[],
  name: string
) => unknown;

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

export function getTreeNodePath(parents: string[], name: string) {
  return [...parents, name].join('/');
}

export function useTreeExpansionToggle(
  expansion: TreeExpansion,
  setExpansion: (treeExpansion: TreeExpansion) => unknown
) {
  return useCallback<OnTreeExpansionToggle>(
    (parents, name) => {
      const nodePath = getTreeNodePath(parents, name);
      // console.log(expansion);
      // console.log({ ...expansion, [nodePath]: !expansion[nodePath] });
      setExpansion({ ...expansion, [nodePath]: !expansion[nodePath] });
    },
    [expansion, setExpansion]
  );
}
