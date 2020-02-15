import { forEach } from 'lodash';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { TreeNodeDirs } from '../tree';
import { FixtureNode } from './shared';

export function hideSingleChildDirs(rootNode: FixtureNode): FixtureNode {
  const { items, dirs } = rootNode;

  const dirNames = Object.keys(dirs);
  if (containsSingleDir(rootNode)) {
    return hideSingleChildDirs(dirs[dirNames[0]]);
  }

  const newDirs: TreeNodeDirs<FixtureId> = {};
  forEach(dirs, (dir, dirName) => {
    const subDirNames = Object.keys(dir.dirs);
    if (containsSingleDir(dir) && !newDirs[subDirNames[0]]) {
      newDirs[subDirNames[0]] = hideSingleChildDirs(dir.dirs[subDirNames[0]]);
    } else {
      newDirs[dirName] = hideSingleChildDirs(dir);
    }
  });

  return { items, dirs: newDirs };
}

function containsSingleDir({ items, dirs }: FixtureNode) {
  return Object.keys(items).length == 0 && Object.keys(dirs).length == 1;
}
