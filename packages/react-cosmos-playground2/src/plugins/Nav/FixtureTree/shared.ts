type Fixtures = {
  [fixtureName: string]: string;
};

export type TreeNodeDirs = {
  [dirName: string]: TreeNode;
};

export type TreeNode = {
  fixtures: Fixtures;
  dirs: TreeNodeDirs;
};

export type TreeExpansion = {
  [nodePath: string]: boolean;
};
