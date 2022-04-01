import React, { RefObject } from 'react';
import styled from 'styled-components';
import { FixtureId } from '../../../../renderer/types';
import {
  grey144,
  grey192,
  grey248,
  grey8,
  selectedColors,
} from '../../../core/colors';
import { quick } from '../../../core/vars';
import { FixtureLink } from './FixtureLink';
import { FixtureTreeItem } from './FixtureTreeItem';

type Props = {
  name: string;
  fixtureId: FixtureId;
  indentLevel: number;
  selected: boolean;
  selectedRef: RefObject<HTMLElement>;
  onSelect: (fixtureId: FixtureId) => unknown;
};

export function MultiFixtureChildButton({
  name,
  fixtureId,
  indentLevel,
  selected,
  selectedRef,
  onSelect,
}: Props) {
  return (
    <FixtureLink fixtureId={fixtureId} onSelect={onSelect}>
      <TreeItem
        ref={selected ? selectedRef : undefined}
        indentLevel={indentLevel}
        selected={selected}
      >
        <Name>{name}</Name>
      </TreeItem>
    </FixtureLink>
  );
}

const Name = styled.span`
  flex-shrink: 0;
  padding: 0 8px 0 16px;
  white-space: nowrap;
  transition: opacity ${quick}s;
`;

const TreeItem = styled(FixtureTreeItem)`
  background: ${grey8};
  color: ${selectedColors(grey144, grey248)};

  :hover {
    background: ${grey8};
    color: ${selectedColors(grey192, grey248)};
  }
`;
