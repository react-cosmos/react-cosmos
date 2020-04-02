import { FixtureNamesByPath } from '../renderer';
import { collapseDirs } from './collapseDirs';
import { collapseSoloIndexes } from './collapseSoloIndexes';
import { collapseSoloNamedItems } from './collapseSoloNamedItems';
import { createRawFixtureTree } from './createRawFixtureTree';
import { hideFixtureSuffix } from './hideFixtureSuffix';
import { hideSingleChildDirs } from './hideSingleChildDirs';
import { FixtureNode } from './shared/types';

export { getSortedNodeDirNames } from './shared/getSortedNodeDirNames';
export { FixtureNode, TreeNode, TreeNodeDirs } from './shared/types';

export function createFixtureTree({
  fixtures,
  fixturesDir,
  fixtureFileSuffix
}: {
  fixtures: FixtureNamesByPath;
  fixturesDir: string;
  fixtureFileSuffix: string;
}): FixtureNode {
  let tree = createRawFixtureTree(fixtures);
  tree = collapseDirs(tree, fixturesDir);
  tree = hideFixtureSuffix(tree, fixtureFileSuffix);
  tree = collapseSoloIndexes(tree);
  tree = collapseSoloNamedItems(tree);
  tree = hideSingleChildDirs(tree);
  return tree;
}
