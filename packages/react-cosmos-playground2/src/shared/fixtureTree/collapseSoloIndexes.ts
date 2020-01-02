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
    const dirItems = dirNode.items;
    const dirIndexItem = dirItems.index || dirItems[dirName];
    const containsSoloIndexItem =
      Object.keys(dirItems).length === 1 && dirIndexItem;
    const hasSubdirs = Object.keys(dirNode.dirs).length > 0;

    if (containsSoloIndexItem && !items[dirName] && !hasSubdirs) {
      items[dirName] = dirIndexItem;
    } else {
      dirs[dirName] = collapseSoloIndexes(dirNode);
    }
  });

  return { items, dirs };
}
