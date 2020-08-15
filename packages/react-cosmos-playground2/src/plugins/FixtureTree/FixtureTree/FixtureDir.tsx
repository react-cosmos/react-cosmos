import React, { RefObject } from 'react';
import styled from 'styled-components';
import { blue, grey128 } from '../../../shared/colors';
import { ChevronDownIcon, ChevronRightIcon } from '../../../shared/icons';
import { OnTreeExpansionToggle } from '../../../shared/treeExpansion';
import { FixtureTreeItem } from './FixtureTreeItem';

type Props = {
  name: string;
  parents: string[];
  expanded: boolean;
  selected: boolean;
  selectedRef: RefObject<HTMLElement>;
  onToggle: OnTreeExpansionToggle;
};

export function FixtureDir({
  name,
  parents,
  expanded,
  selected,
  selectedRef,
  onToggle,
}: Props) {
  return (
    <DirButton onClick={() => onToggle(parents, name)}>
      <FixtureTreeItem
        ref={selected ? selectedRef : undefined}
        indentLevel={parents.length}
        selected={selected}
      >
        <CevronContainer>
          {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </CevronContainer>
        <Name>{name}</Name>
      </FixtureTreeItem>
    </DirButton>
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
      box-shadow: inset 2px 0px 0 0 ${blue};
    }
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const iconSize = 16;

const CevronContainer = styled.span`
  flex-shrink: 0;
  width: ${iconSize}px;
  height: ${iconSize}px;
  color: ${grey128};

  svg {
    margin-left: -2px;
  }
`;

const Name = styled.span`
  flex-shrink: 0;
  padding-right: 8px;
  white-space: nowrap;
`;
