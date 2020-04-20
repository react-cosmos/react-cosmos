import { map } from 'lodash';
import React from 'react';
import {
  getSortedNodeDirNames,
  TreeNode,
} from 'react-cosmos-shared2/fixtureTree';

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
  onTreeExpansionChange,
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
          {getSortedNodeDirNames(dirs).map(dirName => {
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

function getNodePath(nodeParents: string[]) {
  return nodeParents.join('/');
}
