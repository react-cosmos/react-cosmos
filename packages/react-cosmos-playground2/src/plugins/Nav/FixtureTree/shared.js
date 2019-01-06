// @flow

type Fixtures = {
  [fixtureName: string]: string
};

export type TreeNode = {
  fixtures: Fixtures,
  dirs: {
    [dirName: string]: TreeNode
  }
};

export type TreeExpansion = {
  [nodePath: string]: boolean
};
