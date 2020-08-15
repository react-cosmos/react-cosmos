export type TreeNode<T> = {
  data: T;
  children?: Record<string, TreeNode<T>>;
};

export function addTreeNodeChild<T>(
  parentNode: TreeNode<T>,
  childName: string,
  childNode: TreeNode<T>
) {
  if (!parentNode.children) parentNode.children = {};
  parentNode.children[childName] = childNode;
}

// TODO: sortTreeChildNames
// TODO: Call this when building the tree, not when showing it
export function getSortedTreeChildNames<T>(node: TreeNode<T>): string[] {
  const { children } = node;
  if (!children) return [];

  const childNames = Object.keys(children);
  const parentNames = childNames.filter(n => children[n].children);
  const leafNames = childNames.filter(n => !children[n].children);

  // Group by parent and leaf nodes, and sort alphabetically within each group
  return [...parentNames.sort(), ...leafNames.sort()];
}
