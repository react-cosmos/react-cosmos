// @flow

export type TreeNode<T> = {
  values?: T[],
  children: {
    [dir: string]: TreeNode<T>
  }
};

export type TreeExpansion = {
  [nodePath: string]: boolean
};
