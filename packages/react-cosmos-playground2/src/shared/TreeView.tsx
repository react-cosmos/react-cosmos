import React, { ReactNode } from 'react';
import { getSortedTreeChildNames, TreeNode } from 'react-cosmos-shared2/util';
import { getTreeNodePath, TreeExpansion } from './treeExpansion';

type Props<Item> = {
  node: TreeNode<Item>;
  name?: string;
  parents?: string[];
  expansion: TreeExpansion;
  renderNode: (args: {
    node: TreeNode<Item>;
    name: string;
    parents: string[];
  }) => ReactNode;
};

export function TreeView<Item>({
  node,
  name,
  parents = [],
  expansion,
  renderNode,
}: Props<Item>) {
  const { children } = node;
  // The root node doesn't have a name and isn't rendered
  // And the children of the root node are always expanded
  const expanded = name ? expansion[getTreeNodePath(parents, name)] : true;
  return (
    <>
      {name !== undefined && renderNode({ node, name, parents })}
      {children &&
        expanded &&
        getSortedTreeChildNames(node).map(childName => {
          const childNode = children[childName];
          const nextParents = name ? [...parents, name] : parents;
          return (
            <TreeView
              key={childName}
              node={childNode}
              name={childName}
              parents={nextParents}
              expansion={expansion}
              renderNode={renderNode}
            />
          );
        })}
    </>
  );
}
