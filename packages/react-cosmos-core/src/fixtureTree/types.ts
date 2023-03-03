import { FixtureId } from '../fixture/types.js';
import { TreeNode } from '../utils/tree.js';

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
