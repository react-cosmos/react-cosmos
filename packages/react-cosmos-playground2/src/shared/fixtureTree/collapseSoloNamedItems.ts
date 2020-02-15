import { forEach } from 'lodash';
import { FixtureNode, FixtureNodeDirs } from './shared';

export function collapseSoloNamedItems(treeNode: FixtureNode): FixtureNode {
  const items = { ...treeNode.items };
  const dirs: FixtureNodeDirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirItems = dirNode.items;
    const itemNames = Object.keys(dirItems);
    const soloNamedItem =
      itemNames.length === 1 && noCaseEqual(dirName, itemNames[0]);
    const hasSubdirs = Object.keys(dirNode.dirs).length > 0;

    if (soloNamedItem && !hasSubdirs) {
      items[itemNames[0]] = dirItems[itemNames[0]];
    } else {
      dirs[dirName] = collapseSoloNamedItems(dirNode);
    }
  });

  return { items, dirs };
}

function noCaseEqual(a: string, b: string) {
  return a.toUpperCase() === b.toUpperCase();
}
