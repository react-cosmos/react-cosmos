// @flow

export type TreeNode = {
  fixtures?: string[],
  dirs: {
    [dirName: string]: TreeNode
  }
};

export type TreeExpansion = {
  [nodePath: string]: boolean
};
