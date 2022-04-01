import React from 'react';
import { FixtureStateValues } from '../../../utils/fixtureState/types';
import { IconButton32 } from '../../ui/components/buttons';
import { MinusSquareIcon, PlusSquareIcon } from '../../ui/components/icons';
import {
  getFullTreeExpansion,
  hasExpandableNodes,
  isTreeFullyCollapsed,
  TreeExpansion,
} from '../treeExpansion';
import { createValueTree } from './valueTree';

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
