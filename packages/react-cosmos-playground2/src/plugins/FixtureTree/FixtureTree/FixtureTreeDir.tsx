import React from 'react';
import styled from 'styled-components';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon
} from '../../../shared/icons';
import { ListItem, Unshirinkable, Label } from './shared';

type Props = {
  parents: string[];
  isExpanded: boolean;
  onToggle: () => unknown;
};

export function FixtureTreeDir({ parents, isExpanded, onToggle }: Props) {
  const dirName = parents[parents.length - 1];
  return (
    <DirButton onClick={onToggle}>
      <ListItem indentLevel={parents.length - 1}>
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
