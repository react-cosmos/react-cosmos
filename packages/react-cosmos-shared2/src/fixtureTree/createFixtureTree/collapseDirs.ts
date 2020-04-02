import { forEach } from 'lodash';
import { FixtureNode, FixtureNodes } from '../shared/types';

export function collapseDirs(
  treeNode: FixtureNode,
  collapsedDirName: string
): FixtureNode {
  let items = { ...treeNode.items };
  const dirs: FixtureNodes = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    if (dirName !== collapsedDirName) {
      dirs[dirName] = collapseDirs(dirNode, collapsedDirName);
      return;
    }

    if (dirNode.items) {
      items = {
        ...items,
        ...dirNode.items
      };
    }

    forEach(dirNode.dirs, (childDirNode, childDirName) => {
      dirs[childDirName] = collapseDirs(childDirNode, collapsedDirName);
    });
  });

  return { items, dirs };
}
