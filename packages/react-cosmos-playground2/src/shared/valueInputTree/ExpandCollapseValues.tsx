import React from 'react';
import { FixtureStateValues } from 'react-cosmos-shared2/fixtureState';
import { IconButton32 } from '../buttons';
import { MinusSquareIcon, PlusSquareIcon } from '../icons';
import { hasNonEmptyDirs } from '../tree';
import { getFullTreeExpansion, isTreeFullyCollapsed } from '../treeExpansion';
import { TreeExpansion } from '../TreeView';
import { getFixtureStateValueTree } from './valueTree';

type Props = {
  values: FixtureStateValues;
  treeExpansion: TreeExpansion;
  onTreeExpansionChange: (treeExpansion: TreeExpansion) => unknown;
};

// TODO: Turn this into a slot plug
export function ExpandCollapseValues({
  values,
  treeExpansion,
  onTreeExpansionChange,
}: Props) {
  const rootNode = getFixtureStateValueTree(values);

  if (!hasNonEmptyDirs(rootNode)) return null;

  return isTreeFullyCollapsed(treeExpansion) ? (
    <IconButton32
      title="Expand all fixture tree folders"
      icon={<PlusSquareIcon />}
      onClick={() => onTreeExpansionChange(getFullTreeExpansion(rootNode))}
    />
  ) : (
    <IconButton32
      title="Collapse all fixture tree folders"
      icon={<MinusSquareIcon />}
      onClick={() => onTreeExpansionChange({})}
    />
  );
}
