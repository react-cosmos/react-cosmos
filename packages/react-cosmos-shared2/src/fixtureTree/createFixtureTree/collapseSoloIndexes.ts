import { forEach } from 'lodash';
import { FixtureNode, FixtureNodes } from '../shared/types';

export function collapseSoloIndexes(treeNode: FixtureNode): FixtureNode {
  const containsSoloIndexDir =
    Object.keys(treeNode.dirs).length === 1 && treeNode.dirs.index;
  const hasItems = Object.keys(treeNode.items).length !== 0;

  if (containsSoloIndexDir && !hasItems) {
    const indexDirNode = treeNode.dirs.index;
    return collapseSoloIndexes({
      items: indexDirNode.items,
      dirs: indexDirNode.dirs,
    });
  }

  const items = { ...treeNode.items };
  const dirs: FixtureNodes = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirItems = dirNode.items;
    const soloIndexItem = Object.keys(dirItems).length === 1 && dirItems.index;
    const hasSubdirs = Object.keys(dirNode.dirs).length > 0;

    if (soloIndexItem && !items[dirName] && !hasSubdirs) {
      items[dirName] = dirItems.index;
    } else {
      dirs[dirName] = collapseSoloIndexes(dirNode);
    }
  });

  return { items, dirs };
}
