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
    const dirItemNames = Object.keys(dirItems);
    const soloIndexItem = dirItemNames.length === 1 && dirItems.index;
    const soloNamedItem =
      dirItemNames.length === 1 && noCaseEqual(dirName, dirItemNames[0]);
    const hasSubdirs = Object.keys(dirNode.dirs).length > 0;

    if (soloIndexItem && !items[dirName] && !hasSubdirs) {
      items[dirName] = dirItems.index;
    } else if (soloNamedItem && !items[dirItemNames[0]] && !hasSubdirs) {
      items[dirItemNames[0]] = dirItems[dirItemNames[0]];
    } else {
      dirs[dirName] = collapseSoloIndexes(dirNode);
    }
  });

  return { items, dirs };
}

function noCaseEqual(a: string, b: string) {
  return a.toUpperCase() === b.toUpperCase();
}
