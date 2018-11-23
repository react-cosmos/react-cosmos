// @flow

export type TreeNode<T> = {
  values?: T[],
  children: {
    [dir: string]: TreeNode<T>
  }
};
