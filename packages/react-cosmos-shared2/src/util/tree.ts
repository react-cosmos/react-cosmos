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
