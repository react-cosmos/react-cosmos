import { forEach } from 'lodash';
import { FixtureNode, FixtureNodes } from '../shared/types';

export function collapseSoloIndexes(treeNode: FixtureNode): FixtureNode {
  const dirs: FixtureNodes = {};
  const items = { ...treeNode.items };

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirItems = dirNode.items;
    const soloIndexItem = Object.keys(dirItems).length === 1 && dirItems.index;
    const hasSubdirs = Object.keys(dirNode.dirs).length > 0;

    if (soloIndexItem && !items[dirName] && !hasSubdirs)
      items[dirName] = dirItems.index;
    else dirs[dirName] = collapseSoloIndexes(dirNode);
  });

  return { dirs, items };
}
