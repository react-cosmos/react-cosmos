import { blue } from 'chalk';
import React from 'react';
import styled from 'styled-components';
import { grey128 } from '../../../ui/colors';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '../../../ui/components/icons';
import { FixtureTreeItem } from './FixtureTreeItem';

type Props = {
  name: string;
  expanded: boolean;
  indentLevel: number;
  selected: boolean;
  onToggle: () => unknown;
};

export function FixtureDir({
  name,
  expanded,
  indentLevel,
  selected,
  onToggle,
}: Props) {
  return (
    <DirButton onClick={onToggle}>
      <FixtureTreeItem indentLevel={indentLevel} selected={selected}>
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
