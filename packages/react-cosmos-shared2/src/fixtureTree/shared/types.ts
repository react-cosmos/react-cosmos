import { FixtureId } from '../../renderer';
import { TreeNode } from '../../util';

export type FixtureTreeNode = TreeNode<
  | { type: 'fileDir' }
  | { type: 'multiFixture' }
  | { type: 'fixture'; fixtureId: FixtureId }
>;
