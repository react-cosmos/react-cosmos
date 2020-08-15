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

export function sortTreeChildren<T>(node: TreeNode<T>): TreeNode<T> {
  const { children } = node;
  if (!children) return node;

  // Group by parent and leaf nodes, and sort alphabetically within each group
  const childNames = Object.keys(children);
  const parentNames = childNames.filter(n => children[n].children);
  const leafNames = childNames.filter(n => !children[n].children);
  const sortedChildNames = [...parentNames.sort(), ...leafNames.sort()];
  return {
    ...node,
    children: sortedChildNames.reduce(
      (newChildren, childName) => ({
        ...newChildren,
        [childName]: sortTreeChildren(children[childName]),
      }),
      {}
    ),
  };
}
