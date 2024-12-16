import React, { RefObject } from 'react';
import { FixtureId } from 'react-cosmos-core';
import styled from 'styled-components';
import { quick } from '../../../style/vars.js';
import { FixtureLink } from './FixtureLink.js';
import { FixtureTreeItem } from './FixtureTreeItem.js';

type Props = {
  name: string;
  fixturePath: string;
  indentLevel: number;
  selected: boolean;
  selectedRef: RefObject<HTMLElement | null>;
  onSelect: (fixtureId: FixtureId) => unknown;
};

export function FixtureButton({
  name,
  fixturePath,
  indentLevel,
  selected,
  selectedRef,
  onSelect,
}: Props) {
  return (
    <FixtureLink fixtureId={{ path: fixturePath }} onSelect={onSelect}>
      <FixtureTreeItem
        ref={selected ? selectedRef : undefined}
        indentLevel={indentLevel}
        selected={selected}
      >
        <Name>{name}</Name>
      </FixtureTreeItem>
    </FixtureLink>
  );
}

const Name = styled.span`
  flex-shrink: 0;
  padding: 0 8px 0 16px;
  white-space: nowrap;
  transition: opacity ${quick}s;
`;
