import { TreeNodes } from './shared/types';

export function getSortedNodeDirNames(nodeDirs: TreeNodes<any>): string[] {
  return (
    Object.keys(nodeDirs)
      .slice()
      // Sort alphabetically
      .sort()
  );
}
