import { FixtureNode } from './shared';

export function hideSingleChildDirs(treeNode: FixtureNode): FixtureNode {
  const { items, dirs } = treeNode;
  const dirNames = Object.keys(dirs);

  const hasSingleChild = Object.keys(items).length == 0 && dirNames.length == 1;
  if (hasSingleChild) {
    return hideSingleChildDirs(dirs[dirNames[0]]);
  }

  return { items, dirs };
}
