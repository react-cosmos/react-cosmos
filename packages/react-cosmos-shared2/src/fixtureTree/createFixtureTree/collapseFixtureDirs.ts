import { forEach } from 'lodash';
import { FixtureNode, FixtureNodes } from '../shared/types';

export function collapseFixtureDirs(
  treeNode: FixtureNode,
  collapsedDirName: string
): FixtureNode {
  const dirs: FixtureNodes = {};
  let items = { ...treeNode.items };

  forEach(treeNode.dirs, (dirNode, dirName) => {
    if (dirName !== collapsedDirName) {
      dirs[dirName] = collapseFixtureDirs(dirNode, collapsedDirName);
      return;
    }

    if (dirNode.items)
      items = {
        ...items,
        ...dirNode.items,
      };

    forEach(dirNode.dirs, (childDirNode, childDirName) => {
      dirs[childDirName] = collapseFixtureDirs(childDirNode, collapsedDirName);
    });
  });

  return { dirs, items };
}
