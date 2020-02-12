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
    const dirMainItem = dirItems.index || dirItems[dirName];
    const containsSoloItem = Object.keys(dirItems).length === 1 && dirMainItem;
    const hasSubdirs = Object.keys(dirNode.dirs).length > 0;

    if (containsSoloItem && !items[dirName] && !hasSubdirs) {
      items[dirName] = dirMainItem;
    } else {
      const containsSoloNamedDir =
        Object.keys(dirNode.dirs).length === 1 && dirNode.dirs[dirName];
      if (containsSoloNamedDir) {
        dirs[dirName] = collapseSoloIndexes(dirNode.dirs[dirName]);
      } else {
        dirs[dirName] = collapseSoloIndexes(dirNode);
      }
    }
  });

  return { items, dirs };
}
