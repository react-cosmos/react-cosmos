export type TreeNode<Item> = {
  dirs: TreeNodes<Item>;
  items: { [itemName: string]: Item };
};

export type TreeNodes<Item> = {
  [dirName: string]: TreeNode<Item>;
};

export type FixtureNodeItem = {
  fixturePath: string;
  fixtureNames: null | string[];
};

export type FixtureNode = TreeNode<FixtureNodeItem>;
export type FixtureNodes = TreeNodes<FixtureNodeItem>;
