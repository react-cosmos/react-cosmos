import React, { RefObject } from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import {
  grey144,
  grey192,
  grey248,
  grey8,
  selectedColors,
} from '../../../shared/colors';
import { quick } from '../../../shared/vars';
import { FixtureLink } from './FixtureLink';
import { FixtureTreeItem } from './FixtureTreeItem';

type Props = {
  name: string;
  fixtureId: FixtureId;
  indentLevel: number;
  selected: boolean;
  ref?: RefObject<HTMLElement>;
  onSelect: (fixtureId: FixtureId) => unknown;
};

export function MultiFixtureChildButton({
  name,
  fixtureId,
  indentLevel,
  selected,
  ref,
  onSelect,
}: Props) {
  return (
    <FixtureLink fixtureId={fixtureId} onSelect={onSelect}>
      <ChildTreeItem ref={ref} indentLevel={indentLevel} selected={selected}>
        <Name>{name}</Name>
      </ChildTreeItem>
    </FixtureLink>
  );
}

const Name = styled.span`
  flex-shrink: 0;
  padding: 0 8px 0 16px;
  white-space: nowrap;
  transition: opacity ${quick}s;
`;

const ChildTreeItem = styled(FixtureTreeItem)`
  background: ${grey8};
  color: ${selectedColors(grey144, grey248)};

  :hover {
    background: ${grey8};
    color: ${selectedColors(grey192, grey248)};
  }
`;
