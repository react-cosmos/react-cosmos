import { FixtureNamesByPath } from '../../renderer';
import { sortTreeChildren } from '../../util';
import { FixtureTreeNode } from '../shared/types';
import { collapseFixtureDirs } from './collapseFixtureDirs';
import { collapseIndexes } from './collapseIndexes';
import { collapseNamedIndexes } from './collapseNamedIndexes';
import { collapseOuterDirs } from './collapseOuterDirs';
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
}): FixtureTreeNode {
  let tree = createRawFixtureTree(fixtures);
  tree = collapseFixtureDirs(tree, fixturesDir);
  tree = hideFixtureSuffix(tree, fixtureFileSuffix);
  tree = collapseIndexes(tree);
  tree = collapseNamedIndexes(tree);
  tree = collapseOuterDirs(tree);
  return sortTreeChildren(tree);
}
