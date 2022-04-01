import React, { ReactNode, useCallback } from 'react';
import { TreeNode } from '../../utils/tree.js';
import { TreeExpansion } from '../shared/treeExpansion.js';

type Props<Item> = {
  node: TreeNode<Item>;
  name?: string;
  parents?: string[];
  expansion: TreeExpansion;
  setExpansion: (expansion: TreeExpansion) => unknown;
  renderNode: (args: {
    node: TreeNode<Item>;
    name: string;
    parents: string[];
    expanded: boolean;
    onToggle: () => unknown;
  }) => ReactNode;
};

// The root doesn't have a name and its data isn't rendered
// And the children of the root node are always expanded
export function TreeView<Item>({
  node,
  name,
  parents = [],
  expansion,
  setExpansion,
  renderNode,
}: Props<Item>) {
  const expanded = name ? expansion[getTreeNodePath(parents, name)] : true;
  const onToggle = useCallback(() => {
    if (name) {
      const nodePath = getTreeNodePath(parents, name);
      setExpansion({ ...expansion, [nodePath]: !expansion[nodePath] });
    }
  }, [expansion, name, parents, setExpansion]);

  const { children } = node;
  return (
    <>
      {name !== undefined &&
        renderNode({ node, name, parents, expanded, onToggle })}
      {children &&
        expanded &&
        Object.keys(children).map(childName => {
          const childNode = children[childName];
          const nextParents = name ? [...parents, name] : parents;
          return (
            <TreeView
              key={childName}
              node={childNode}
              name={childName}
              parents={nextParents}
              expansion={expansion}
              setExpansion={setExpansion}
              renderNode={renderNode}
            />
          );
        })}
    </>
  );
}

function getTreeNodePath(parents: string[], name: string) {
  return [...parents, name].join('/');
}
