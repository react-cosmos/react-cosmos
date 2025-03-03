import React, { RefObject } from 'react';
import { FixtureId } from 'react-cosmos-core';
import { usePlugContext } from 'react-plugin';
import styled from 'styled-components';
import { quick } from '../../../style/vars.js';
import { RootSpec } from '../../Root/spec.js';
import { FixtureTreeSpec } from '../spec.js';
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
  const { pluginContext } = usePlugContext<FixtureTreeSpec>();
  const root = pluginContext.getMethodsOf<RootSpec>('root');
  const floatingPanes = true;

  function handleSelect(fixtureId: FixtureId) {
    onSelect(fixtureId);
    if (floatingPanes) root.closeFixtureList();
  }

  return (
    <FixtureLink fixtureId={{ path: fixturePath }} onSelect={handleSelect}>
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
