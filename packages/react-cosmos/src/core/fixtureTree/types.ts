import { FixtureId } from '../../renderer/types';
import { TreeNode } from '../../utils/tree';

export type FixtureTreeNode = TreeNode<
  | { type: 'fileDir' }
  | { type: 'fixture'; fixtureId: FixtureId }
  | { type: 'multiFixture'; fixtureIds: Record<string, FixtureId> }
>;
