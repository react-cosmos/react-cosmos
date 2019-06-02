import React from 'react';
import { map } from 'lodash';

export type TreeNode<Item> = {
  items: { [itemName: string]: Item };
  dirs: TreeNodeDirs<Item>;
};

export type TreeNodeDirs<Item> = {
  [dirName: string]: TreeNode<Item>;
};

export type TreeExpansion = {
  [nodePath: string]: boolean;
};

type Props<Item> = {
  node: TreeNode<Item>;
  parents?: string[];
  treeExpansion: TreeExpansion;
  renderDir: (args: {
    node: TreeNode<Item>;
    parents: string[];
    isExpanded: boolean;
    onToggle: () => unknown;
  }) => React.ReactNode;
  renderItem: (args: {
    parents: string[];
    item: Item;
    itemName: string;
  }) => React.ReactNode;
  onTreeExpansionChange: (newTreeExpansion: TreeExpansion) => unknown;
};

export function TreeView<Item>({
  node,
  parents = [],
  treeExpansion,
  renderDir,
  renderItem,
  onTreeExpansionChange
}: Props<Item>) {
  const { items, dirs } = node;
  const nodePath = getNodePath(parents);
  const isRootNode = parents.length === 0;
  const isExpanded = isRootNode || treeExpansion[nodePath];
  const onToggle = React.useCallback(
    () => onTreeExpansionChange({ ...treeExpansion, [nodePath]: !isExpanded }),
    [onTreeExpansionChange, treeExpansion, nodePath, isExpanded]
  );

  return (
    <>
      {!isRootNode && renderDir({ node, parents, isExpanded, onToggle })}
      {isExpanded && (
        <>
          {getSortedNodeDirNames(node).map(dirName => {
            const nextParents = [...parents, dirName];
            return (
              <TreeView
                key={getNodePath(nextParents)}
                node={dirs[dirName]}
                parents={nextParents}
                treeExpansion={treeExpansion}
                renderDir={renderDir}
                renderItem={renderItem}
                onTreeExpansionChange={onTreeExpansionChange}
              />
            );
          })}
          {map(items, (item, itemName) => (
            <React.Fragment key={itemName}>
              {renderItem({ parents, item, itemName })}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}

function getSortedNodeDirNames(node: TreeNode<any>): string[] {
  return (
    Object.keys(node.dirs)
      .slice()
      // Sort alphabetically first
      .sort()
      .sort((dirName1, dirName2) => {
        return (
          calcNodeDepth(node.dirs[dirName2]) -
          calcNodeDepth(node.dirs[dirName1])
        );
      })
  );
}

// Only differentiate between nodes with and without subdirs and ignore
// depth level in the latter
function calcNodeDepth(node: TreeNode<any>): 0 | 1 {
  const hasDirs = Object.keys(node.dirs).length > 0;
  return hasDirs ? 1 : 0;
}

function getNodePath(nodeParents: string[]) {
  return nodeParents.join('/');
}
