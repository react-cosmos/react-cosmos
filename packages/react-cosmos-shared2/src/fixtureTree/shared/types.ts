import { FixtureId } from '../../renderer';

export type TreeNode<Item> = {
  items: { [itemName: string]: Item };
  dirs: TreeNodes<Item>;
};

export type TreeNodes<Item> = {
  [dirName: string]: TreeNode<Item>;
};

export type FixtureNode = TreeNode<FixtureId>;
export type FixtureNodes = TreeNodes<FixtureId>;
