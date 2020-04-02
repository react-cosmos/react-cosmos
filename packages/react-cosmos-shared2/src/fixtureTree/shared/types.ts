import { FixtureId } from '../../renderer';

export type TreeNode<Item> = {
  items: { [itemName: string]: Item };
  dirs: TreeNodeDirs<Item>;
};

export type TreeNodeDirs<Item> = {
  [dirName: string]: TreeNode<Item>;
};

export type FixtureNode = TreeNode<FixtureId>;
export type FixtureNodeDirs = TreeNodeDirs<FixtureId>;
