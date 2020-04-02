import { TreeNode, TreeNodes } from './shared/types';

export function getSortedNodeDirNames(nodeDirs: TreeNodes<any>): string[] {
  return (
    Object.keys(nodeDirs)
      .slice()
      // Sort alphabetically first
      .sort()
      .sort((dirName1, dirName2) => {
        return (
          calcNodeDepth(nodeDirs[dirName2]) - calcNodeDepth(nodeDirs[dirName1])
        );
      })
  );
}

// Only differentiate between nodes with and without subdirs and ignore
// depth level in the latter
function calcNodeDepth(node: TreeNode<any>): 0 | 1 {
  const hasDirs = Object.keys(node.dirs).length > 0;
  return hasDirs ? 1 : 0;
}
