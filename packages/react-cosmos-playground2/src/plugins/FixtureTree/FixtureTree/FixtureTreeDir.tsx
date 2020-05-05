import { isEqual } from 'lodash';
import React, { RefObject } from 'react';
import { FixtureNode } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
} from '../../../shared/icons';
import { blue, grey128 } from '../../../shared/ui/colors';
import { Label, ListItem, Unshirinkable } from './shared';

type Props = {
  node: FixtureNode;
  parents: string[];
  isExpanded: boolean;
  selectedFixtureId: null | FixtureId;
  selectedRef: RefObject<HTMLElement>;
  onToggle: () => unknown;
};

export function FixtureTreeDir({
  node,
  parents,
  isExpanded,
  selectedFixtureId,
  selectedRef,
  onToggle,
}: Props) {
  const dirName = parents[parents.length - 1];
  const containsSelectedFixture =
    selectedFixtureId !== null && treeContainsFixture(node, selectedFixtureId);
  const selected = !isExpanded && containsSelectedFixture;
  return (
    <DirButton onClick={onToggle}>
      <ListItem
        ref={selected ? selectedRef : undefined}
        indentLevel={parents.length - 1}
        selected={selected}
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
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 14px;

  :focus {
    outline: none;
    > span {
      box-shadow: inset 3px 0px 0 0 ${blue};
    }
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const iconSize = 16;

const IconContainer = styled(Unshirinkable)`
  width: ${iconSize}px;
  height: ${iconSize}px;
  color: ${grey128};
`;

const CevronContainer = styled(IconContainer)`
  padding-right: 2px;
  margin-left: -2px;
`;

const FolderContainer = styled(IconContainer)`
  padding-right: 6px;
`;
