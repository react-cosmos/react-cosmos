import { FixtureNamesByPath } from '../../renderer';
import { FixtureNode } from '../shared/types';
import { collapseFixtureDirs } from './collapseFixtureDirs';
import { collapseSingleChildDirs } from './collapseSingleChildDirs';
import { collapseSoloIndexes } from './collapseSoloIndexes';
import { collapseSoloNamedItems } from './collapseSoloNamedItems';
import { createRawFixtureTree } from './createRawFixtureTree';
import { hideFixtureSuffix } from './hideFixtureSuffix';

export function createFixtureTree({
  fixtures,
  fixturesDir,
  fixtureFileSuffix,
}: {
  fixtures: FixtureNamesByPath;
  fixturesDir: string;
  fixtureFileSuffix: string;
}): FixtureNode {
  let tree = createRawFixtureTree(fixtures);
  tree = collapseFixtureDirs(tree, fixturesDir);
  tree = hideFixtureSuffix(tree, fixtureFileSuffix);
  tree = collapseSoloIndexes(tree);
  tree = collapseSoloNamedItems(tree);
  tree = collapseSingleChildDirs(tree);
  return tree;
}
