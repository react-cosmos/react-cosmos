import React, { RefObject } from 'react';
import { FixtureId } from 'react-cosmos-core';
import { usePlugContext } from 'react-plugin';
import styled from 'styled-components';
import {
  grey144,
  grey192,
  grey248,
  grey8,
  selectedColors,
} from '../../../style/colors.js';
import { quick } from '../../../style/vars.js';
import { RootSpec } from '../../Root/spec.js';
import { FixtureTreeSpec } from '../spec.js';
import { FixtureLink } from './FixtureLink.js';
import { FixtureTreeItem } from './FixtureTreeItem.js';

type Props = {
  name: string;
  fixtureId: FixtureId;
  indentLevel: number;
  selected: boolean;
  selectedRef: RefObject<HTMLElement | null>;
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
  const { pluginContext } = usePlugContext<FixtureTreeSpec>();
  const root = pluginContext.getMethodsOf<RootSpec>('root');
  const floatingPanes = true;

  function handleSelect() {
    onSelect(fixtureId);
    if (floatingPanes) root.closeFixtureList();
  }

  return (
    <FixtureLink fixtureId={fixtureId} onSelect={handleSelect}>
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
