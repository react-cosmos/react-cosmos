import { FixtureNode } from '../shared/types';

export function hideSingleChildDirs(rootNode: FixtureNode): FixtureNode {
  const { items, dirs } = rootNode;

  const dirNames = Object.keys(dirs);
  if (containsSingleDir(rootNode)) {
    return hideSingleChildDirs(dirs[dirNames[0]]);
  }

  return { items, dirs };
}

function containsSingleDir({ items, dirs }: FixtureNode) {
  return Object.keys(items).length == 0 && Object.keys(dirs).length == 1;
}
