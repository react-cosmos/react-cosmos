import React from 'react';
import { FixtureStateValues } from 'react-cosmos-core';
import {
  getFullTreeExpansion,
  hasExpandableNodes,
  isTreeFullyCollapsed,
  TreeExpansion,
} from '../../shared/treeExpansion.js';
import { IconButton32 } from '../buttons/index.js';
import { MinusSquareIcon, PlusSquareIcon } from '../icons/index.js';
import { createValueTree } from './valueTree.js';

type Props = {
  values: FixtureStateValues;
  expansion: TreeExpansion;
  setExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export function ExpandCollapseValues({
  values,
  expansion,
  setExpansion,
}: Props) {
  const rootNode = createValueTree(values);
  if (!hasExpandableNodes(rootNode)) return null;

  return isTreeFullyCollapsed(expansion) ? (
    <IconButton32
      title="Expand all fixture tree folders"
      icon={<PlusSquareIcon />}
      onClick={() => setExpansion(getFullTreeExpansion(rootNode))}
    />
  ) : (
    <IconButton32
      title="Collapse all fixture tree folders"
      icon={<MinusSquareIcon />}
      onClick={() => setExpansion({})}
    />
  );
}
