export type TreeNode<Item> = {
  items: { [itemName: string]: Item };
  dirs: TreeNodeDirs<Item>;
};

export type TreeNodeDirs<Item> = {
  [dirName: string]: TreeNode<Item>;
};
