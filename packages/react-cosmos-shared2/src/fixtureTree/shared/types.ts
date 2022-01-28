import { FixtureId } from '../../renderer';
import { TreeNode } from '../../util';

export type MultiFixtureTreeNodeData = {
  type: 'multiFixture';
  fixturePath: string;
  fixtureIds: Record<string, FixtureId>;
};

export type FixtureTreeNode = TreeNode<
  | { type: 'unknown'; fixturePath: string } // Lazy fixture not imported yet
  | { type: 'fileDir' }
  | { type: 'fixture'; fixtureId: FixtureId }
  | MultiFixtureTreeNodeData
>;
