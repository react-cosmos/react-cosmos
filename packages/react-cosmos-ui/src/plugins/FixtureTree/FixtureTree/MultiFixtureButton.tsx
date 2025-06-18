import React, { RefObject } from 'react';
import { FixtureId } from 'react-cosmos-core';
import styled from 'styled-components';
import { grey8 } from '../../../style/colors.js';
import { FixtureLink } from './FixtureLink.js';
import { FixtureTreeItem } from './FixtureTreeItem.js';
import { MultiFixtureChildButton } from './MultiFixtureChildButton.js';

type Props = {
  name: string;
  fixturePath: string;
  fixtureNames: string[];
  indentLevel: number;
  selected: boolean;
  selectedFixtureId: null | FixtureId;
  selectedRef: RefObject<HTMLElement | null>;
};

export function MultiFixtureButton({
  name,
  fixturePath,
  fixtureNames,
  indentLevel,
  selected,
  selectedFixtureId,
  selectedRef,
}: Props) {
  if (!selected) {
    const [firstFixtureName] = fixtureNames;
    const fixtureId = firstFixtureName
      ? { path: fixturePath, name: firstFixtureName }
      : { path: fixturePath };

    return (
      <FixtureLink fixtureId={fixtureId} keepNavOpen>
        <FixtureTreeItem indentLevel={indentLevel} selected={false}>
          <Name>{name}</Name>
          <Count>{fixtureNames.length}</Count>
        </FixtureTreeItem>
      </FixtureLink>
    );
  }

  return (
    <>
      <FixtureTreeItem indentLevel={indentLevel} selected={true}>
        <Name>{name}</Name>
        <Count>{fixtureNames.length}</Count>
      </FixtureTreeItem>
      {fixtureNames.map((fixtureName, index) => {
        const fixtureId = { path: fixturePath, name: fixtureName };

        // Select first child when only the path of a multi fixture is selected
        const childSelected =
          selectedFixtureId !== null &&
          selectedFixtureId.path === fixturePath &&
          (selectedFixtureId.name === undefined
            ? index === 0
            : fixtureName === selectedFixtureId.name);

        return (
          <MultiFixtureChildButton
            key={fixtureName}
            name={fixtureName}
            fixtureId={fixtureId}
            indentLevel={indentLevel + 1}
            selected={childSelected}
            selectedRef={selectedRef}
          />
        );
      })}
      <FooterPadding />
    </>
  );
}

const Name = styled.span`
  flex-shrink: 0;
  padding: 0 8px 0 16px;
  white-space: nowrap;
`;

const Count = styled.span`
  margin: 0 8px 0 -3px;
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
