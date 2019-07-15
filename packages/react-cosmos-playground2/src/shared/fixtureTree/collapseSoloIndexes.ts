import { forEach } from 'lodash';
import { FixtureNode, FixtureNodeDirs } from './shared';

export function collapseSoloIndexes(treeNode: FixtureNode): FixtureNode {
  const containsSoloIndexDir =
    Object.keys(treeNode.dirs).length === 1 && treeNode.dirs.index;

  if (containsSoloIndexDir && Object.keys(treeNode.items).length === 0) {
    const indexDirNode = treeNode.dirs.index;
    return collapseSoloIndexes({
      items: indexDirNode.items,
      dirs: indexDirNode.dirs
    });
  }

  const items = { ...treeNode.items };
  const dirs: FixtureNodeDirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirItems = dirNode.items || {};
    const containsSoloIndexItem =
      Object.keys(dirItems).length === 1 && dirItems.index;

    if (containsSoloIndexItem && !items[dirName]) {
      items[dirName] = dirItems.index;
    } else {
      dirs[dirName] = collapseSoloIndexes(dirNode);
    }
  });

  return { items, dirs };
}
