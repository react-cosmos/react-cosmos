import { forEach } from 'lodash';
import { FixtureNode, FixtureNodes } from '../shared/types';

export function collapseSoloNamedItems(treeNode: FixtureNode): FixtureNode {
  const dirs: FixtureNodes = {};
  const items = { ...treeNode.items };

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirItems = dirNode.items;
    const itemNames = Object.keys(dirItems);
    const soloNamedItem =
      itemNames.length === 1 && noCaseEqual(dirName, itemNames[0]);
    const hasSubdirs = Object.keys(dirNode.dirs).length > 0;

    if (soloNamedItem && !hasSubdirs)
      items[itemNames[0]] = dirItems[itemNames[0]];
    else dirs[dirName] = collapseSoloNamedItems(dirNode);
  });

  return { dirs, items };
}

function noCaseEqual(a: string, b: string) {
  return a.toUpperCase() === b.toUpperCase();
}
