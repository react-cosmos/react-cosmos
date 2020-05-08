import React, { useMemo } from 'react';
import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { Button32 } from '../../shared/ui/buttons';
import { grey32, white10 } from '../../shared/ui/colors';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { BlankState } from './BlankState';
import { FixtureTree } from './FixtureTree';
import {
  getFullTreeExpansion,
  hasDirs,
  isFullyCollapsed,
  isFullyExpanded,
} from './fixtureTreeExpansion';
import { useScrollToSelected } from './useScrollToSelected';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  rendererConnected: boolean;
  fixtures: FixtureNamesByPath;
  treeExpansion: TreeExpansion;
  selectFixture: (fixtureId: FixtureId) => void;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export function FixtureTreeContainer({
  fixturesDir,
  fixtureFileSuffix,
  selectedFixtureId,
  rendererConnected,
  fixtures,
  treeExpansion,
  selectFixture,
  setTreeExpansion,
}: Props) {
  const rootNode = useMemo(
    () => createFixtureTree({ fixtures, fixturesDir, fixtureFileSuffix }),
    [fixtures, fixturesDir, fixtureFileSuffix]
  );
  const { containerRef, selectedRef } = useScrollToSelected(selectedFixtureId);

  if (!rendererConnected) return <TreeContainer />;

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
      {hasDirs(rootNode) && (
        <ExpansionMenu>
          <Button32
            title="Reuse instances on prop changes"
            label={'collapse all'}
            disabled={isFullyCollapsed(treeExpansion)}
            onClick={() => setTreeExpansion({})}
          />
          <Button32
            title="Reuse instances on prop changes"
            label={'expand all'}
            disabled={isFullyExpanded(rootNode, treeExpansion)}
            onClick={() => setTreeExpansion(getFullTreeExpansion(rootNode))}
          />
        </ExpansionMenu>
      )}
      <TreeContainer ref={containerRef}>
        <FixtureTree
          rootNode={rootNode}
          selectedFixtureId={selectedFixtureId}
          treeExpansion={treeExpansion}
          selectedRef={selectedRef}
          onSelect={selectFixture}
          setTreeExpansion={setTreeExpansion}
        />
      </TreeContainer>
    </>
  );
}

const ExpansionMenu = styled.div`
  flex-shrink: 0;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid ${white10};
  background: ${grey32};
`;

// The background color is required for the proper scroll bar color theme
const TreeContainer = styled.div`
  flex: 1;
  background: ${grey32};
  overflow: auto;
`;
