import { TreeNode } from '../../utils/tree';
import { FixtureId } from '../types';

export type FixtureTreeNode = TreeNode<
  | { type: 'fileDir' }
  | { type: 'fixture'; fixtureId: FixtureId }
  | { type: 'multiFixture'; fixtureIds: Record<string, FixtureId> }
>;
