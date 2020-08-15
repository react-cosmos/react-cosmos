export type StateUpdater<T> = (prevState: T) => T;

export type Message = {
  type: string;
  payload?: {};
};

export { removeItemMatch, replaceOrAddItem, updateItem } from './array';
export { addTreeNodeChild, getSortedTreeChildNames, TreeNode } from './tree';
export { uuid } from './uuid';
