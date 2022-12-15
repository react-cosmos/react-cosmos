import { FixtureId } from '../fixture/types.js';
import { TreeNode } from '../utils/tree.js';

export type FixtureTreeNode = TreeNode<
  | { type: 'fileDir' }
  | { type: 'fixture'; fixtureId: FixtureId }
  | { type: 'multiFixture'; fixtureIds: Record<string, FixtureId> }
>;
