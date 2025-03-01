import React, { useMemo } from 'react';
import { createFixtureTree, FixtureId, FixtureList } from 'react-cosmos-core';
import styled from 'styled-components';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { grey32 } from '../../style/colors.js';
import { BlankState } from './BlankState.js';
import { FixtureTree } from './FixtureTree/FixtureTree.js';
import { FixtureTreeHeader } from './FixtureTreeHeader.js';
import { useScrollToSelected } from './useScrollToSelected.js';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  fixtures: FixtureList;
  expansion: TreeExpansion;
  selectFixture: (fixtureId: FixtureId) => void;
  setExpansion: (expansion: TreeExpansion) => unknown;
};

export function FixtureTreeContainer({
  fixturesDir,
  fixtureFileSuffix,
  selectedFixtureId,
  fixtures,
  expansion,
  selectFixture,
  setExpansion,
}: Props) {
  const rootNode = useMemo(
    () => createFixtureTree({ fixtures, fixturesDir, fixtureFileSuffix }),
    [fixtures, fixturesDir, fixtureFileSuffix]
  );
  const { containerRef, selectedRef } = useScrollToSelected(selectedFixtureId);

  if (Object.keys(fixtures).length === 0) {
    return (
      <TreeContainer>
        <BlankState
          fixturesDir={fixturesDir}
          fixtureFileSuffix={fixtureFileSuffix}
        />
      </TreeContainer>
    );
  }

  return (
    <>
      <FixtureTreeHeader
        fixturesDir={fixturesDir}
        fixtureFileSuffix={fixtureFileSuffix}
        fixtures={fixtures}
        expansion={expansion}
        setExpansion={setExpansion}
      />
      <TreeContainer ref={containerRef}>
        <FixtureTree
          rootNode={rootNode}
          selectedFixtureId={selectedFixtureId}
          expansion={expansion}
          selectedRef={selectedRef}
          setExpansion={setExpansion}
          onSelect={selectFixture}
        />
      </TreeContainer>
    </>
  );
}

// The background color is required for the proper scroll bar color theme
const TreeContainer = styled.div`
  flex: 1;
  background: ${grey32};
  overflow: auto;
`;
