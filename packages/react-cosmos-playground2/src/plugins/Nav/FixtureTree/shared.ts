import { FixtureId } from 'react-cosmos-shared2/renderer';

type TreeNode<Item> = {
  items: { [itemName: string]: Item };
  dirs: TreeNodeDirs<Item>;
};

type TreeNodeDirs<Item> = {
  [dirName: string]: TreeNode<Item>;
};

export type FixtureTreeNode = TreeNode<FixtureId>;
export type FixtureTreeNodeDirs = TreeNodeDirs<FixtureId>;

export type TreeExpansion = {
  [nodePath: string]: boolean;
};
