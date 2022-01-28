import { FixtureId } from '../../renderer';
import { TreeNode } from '../../util';

export type MultiFixtureTreeNodeData = {
  type: 'multiFixture';
  fixturePath: string;
  fixtureIds: Record<string, FixtureId>;
};

export type FixtureTreeNode = TreeNode<
  | { type: 'fileDir' }
  | { type: 'fixture'; fixtureId: FixtureId }
  | MultiFixtureTreeNodeData
>;
