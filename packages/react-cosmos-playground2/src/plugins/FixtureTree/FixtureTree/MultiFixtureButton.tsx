import { isEqual } from 'lodash';
import React, { RefObject } from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { grey8 } from '../../../shared/colors';
import { FixtureLink } from './FixtureLink';
import { FixtureTreeItem } from './FixtureTreeItem';
import { MultiFixtureChildButton } from './MultiFixtureChildButton';

type Props = {
  name: string;
  fixtureIds: Record<string, FixtureId>;
  indentLevel: number;
  selectedFixtureId: null | FixtureId;
  selectedRef: RefObject<HTMLElement>;
  onSelect: (fixtureId: FixtureId) => unknown;
};

export function MultiFixtureButton({
  name,
  fixtureIds,
  indentLevel,
  selectedFixtureId,
  selectedRef,
  onSelect,
}: Props) {
  const selected = selectedFixtureId
    ? containsFixture(fixtureIds, selectedFixtureId)
    : false;
  const firstFixtureId = fixtureIds[Object.keys(fixtureIds)[0]];

  if (!selected)
    return (
      <FixtureLink fixtureId={firstFixtureId} onSelect={onSelect}>
        <FixtureTreeItem indentLevel={indentLevel} selected={false}>
          <Name>{name}</Name>
          <Count>{Object.keys(fixtureIds).length}</Count>
        </FixtureTreeItem>
      </FixtureLink>
    );

  const fixtureNames = Object.keys(fixtureIds);
  return (
    <>
      <FixtureTreeItem indentLevel={indentLevel} selected={true}>
        <Name>{name}</Name>
        <Count>{fixtureNames.length}</Count>
      </FixtureTreeItem>
      {fixtureNames.map(fixtureName => {
        const fixtureId = fixtureIds[fixtureName];
        const childSelected = isEqual(fixtureId, selectedFixtureId);
        return (
          <MultiFixtureChildButton
            key={fixtureName}
            name={fixtureName}
            fixtureId={fixtureId}
            indentLevel={indentLevel + 1}
            selected={childSelected}
            ref={childSelected ? selectedRef : undefined}
            onSelect={onSelect}
          />
        );
      })}
      <FooterPadding />
    </>
  );
}

function containsFixture(
  fixtureIds: Record<string, FixtureId>,
  fixtureId: FixtureId
): boolean {
  return Object.keys(fixtureIds).some(fixtureName =>
    isEqual(fixtureIds[fixtureName], fixtureId)
  );
}

const Name = styled.span`
  flex-shrink: 0;
  padding: 0 8px 0 16px;
  white-space: nowrap;
`;

const Count = styled.label`
  margin: 0 0 0 -2px;
  padding: 0 4px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  line-height: 18px;
`;

const FooterPadding = styled.div`
  height: 2px;
  background-color: ${grey8};
`;
