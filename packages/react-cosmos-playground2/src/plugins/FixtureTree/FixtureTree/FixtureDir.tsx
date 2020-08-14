import React, { RefObject, useCallback } from 'react';
import styled from 'styled-components';
import { blue, grey128 } from '../../../shared/colors';
import { ChevronDownIcon, ChevronRightIcon } from '../../../shared/icons';
import { OnTreeExpansionToggle } from '../../../shared/treeExpansion';
import { Label, ListItem, Unshirinkable } from './shared';

type Props = {
  name: string;
  parents: string[];
  expanded: boolean;
  containsSelectedFixture: boolean;
  selectedRef: RefObject<HTMLElement>;
  onToggle: OnTreeExpansionToggle;
};

// TODO: Differentiate between fileDir & multiFixture node types
export function FixtureDir({
  name,
  parents,
  expanded,
  containsSelectedFixture,
  selectedRef,
  onToggle,
}: Props) {
  const selected = !expanded && containsSelectedFixture;
  const onClick = useCallback(() => {
    onToggle(parents, name);
  }, [name, onToggle, parents]);

  return (
    <DirButton onClick={onClick}>
      <ListItem
        ref={selected ? selectedRef : undefined}
        indentLevel={parents.length}
        selected={selected}
      >
        <CevronContainer>
          {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </CevronContainer>
        <Label>{name}</Label>
      </ListItem>
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

const CevronContainer = styled(Unshirinkable)`
  width: ${iconSize}px;
  height: ${iconSize}px;
  color: ${grey128};

  svg {
    margin-left: -2px;
  }
`;
