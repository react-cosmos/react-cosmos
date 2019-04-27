import { mapKeys } from 'lodash';
import { FixtureNode } from './shared';

export function hideFixtureSuffix(
  treeNode: FixtureNode,
  suffix: string
): FixtureNode {
  // The fixture name suffix can be found in both dir and item names
  const dirs = Object.keys(treeNode.dirs).reduce((prev, dirName) => {
    const cleanDirName = removeFixtureNameSuffix(dirName, suffix);
    return {
      ...prev,
      [cleanDirName]: hideFixtureSuffix(treeNode.dirs[dirName], suffix)
    };
  }, {});

  const items = mapKeys(treeNode.items, (fixturePath, fixtureName) =>
    removeFixtureNameSuffix(fixtureName, suffix)
  );

  return { items, dirs };
}

function removeFixtureNameSuffix(
  fixtureNameWithoutExtension: string,
  suffix: string
) {
  return fixtureNameWithoutExtension.replace(new RegExp(`\\.${suffix}$`), '');
}
