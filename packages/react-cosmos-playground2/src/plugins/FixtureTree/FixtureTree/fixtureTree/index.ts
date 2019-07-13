import { FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import { createFixtureTree } from './createFixtureTree';
import { collapseDirs } from './collapseDirs';
import { hideFixtureSuffix } from './hideFixtureSuffix';
import { collapseSoloIndexes } from './collapseSoloIndexes';
import { hideSingleChildDirs } from './hideSingleChildDirs';
import { FixtureNode } from './shared';

// Types can't be re-exported because Babel (see root tsconfig.json)
export type FixtureNode = FixtureNode;

export function getFixtureTree({
  fixtures,
  fixturesDir,
  fixtureFileSuffix
}: {
  fixtures: FixtureNamesByPath;
  fixturesDir: string;
  fixtureFileSuffix: string;
}): FixtureNode {
  let tree = createFixtureTree(fixtures);
  tree = collapseDirs(tree, fixturesDir);
  tree = hideFixtureSuffix(tree, fixtureFileSuffix);
  tree = collapseSoloIndexes(tree);
  tree = hideSingleChildDirs(tree);
  return tree;
}
