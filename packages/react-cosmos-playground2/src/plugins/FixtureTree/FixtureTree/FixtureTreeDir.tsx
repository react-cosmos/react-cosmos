import React from 'react';
import { isEqual } from 'lodash';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { FixtureNode } from '../../../shared/fixtureTree';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon
} from '../../../shared/icons';
import { Label, ListItem, Unshirinkable } from './shared';

type Props = {
  node: FixtureNode;
  parents: string[];
  isExpanded: boolean;
  selectedFixtureId: null | FixtureId;
  onToggle: () => unknown;
};

export function FixtureTreeDir({
  node,
  parents,
  selectedFixtureId,
  isExpanded,
  onToggle
}: Props) {
  const dirName = parents[parents.length - 1];
  const containsSelectedFixture =
    selectedFixtureId !== null && treeContainsFixture(node, selectedFixtureId);
  return (
    <DirButton onClick={onToggle}>
      <ListItem
        indentLevel={parents.length - 1}
        selected={!isExpanded && containsSelectedFixture}
      >
        <CevronContainer>
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </CevronContainer>
        <FolderContainer>
          <FolderIcon />
        </FolderContainer>
        <Label>{dirName}</Label>
      </ListItem>
    </DirButton>
  );
}

function treeContainsFixture(
  { dirs, items }: FixtureNode,
  fixtureId: FixtureId
): boolean {
  const itemNames = Object.keys(items);
  if (itemNames.some(itemName => isEqual(items[itemName], fixtureId))) {
    return true;
  }

  const dirNames = Object.keys(dirs);
  return dirNames.some(dirName =>
    treeContainsFixture(dirs[dirName], fixtureId)
  );
}

const DirButton = styled.button`
  display: block;
  width: 100%;
  border: 0;
  background: transparent;

  :focus {
    outline: none;
    > span {
      box-shadow: inset 4px 0px 0 0 var(--primary3);
    }
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const IconContainer = styled(Unshirinkable)`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  color: var(--grey3);
`;

const CevronContainer = styled(IconContainer)`
  padding-right: 2px;
  margin-left: -2px;
`;

const FolderContainer = styled(IconContainer)`
  padding-right: 6px;
`;
