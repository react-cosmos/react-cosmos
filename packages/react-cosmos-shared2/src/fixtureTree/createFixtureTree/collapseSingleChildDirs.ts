import { FixtureNode } from '../shared/types';

export function collapseSingleChildDirs(rootNode: FixtureNode): FixtureNode {
  const { dirs, items } = rootNode;

  const dirNames = Object.keys(dirs);
  if (containsSingleDir(rootNode))
    return collapseSingleChildDirs(dirs[dirNames[0]]);

  return { dirs, items };
}

function containsSingleDir({ dirs, items }: FixtureNode) {
  return Object.keys(items).length == 0 && Object.keys(dirs).length == 1;
}
