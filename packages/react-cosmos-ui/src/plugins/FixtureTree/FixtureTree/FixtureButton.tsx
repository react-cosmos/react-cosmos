import React, { RefObject } from 'react';
import { FixtureId } from 'react-cosmos-core';
import { usePlugContext } from 'react-plugin';
import styled from 'styled-components';
import { quick } from '../../../style/vars.js';
import { CoreSpec } from '../../Core/spec.js';
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
  const core = pluginContext.getMethodsOf<CoreSpec>('core');
  const floatingPanes = true;

  function handleSelect(fixtureId: FixtureId) {
    onSelect(fixtureId);
    // TODO: Explicitly closeFixtureList instead of toggling it. At the moment
    // the behavior is inconsistent because the nav is shown when no fixture is
    // selected even though the navOpen state is false. Toggling it in this case
    // will set it to true after opening the fixture.
    if (floatingPanes) core.runCommand('toggleFixtureList');
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
