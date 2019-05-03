import styled from 'styled-components';
import React from 'react';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { FixtureTree } from './FixtureTree';
import { useDrag } from '../../shared/ui';
import { TreeExpansion, restrictNavWidth } from './shared';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  fullScreen: boolean;
  rendererConnected: boolean;
  fixtures: FixtureNamesByPath;
  width: number;
  treeExpansion: TreeExpansion;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
  setWidth: (width: number) => unknown;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

// TODO: Show overlay over renderer preview while dragging
// IDEA: Split into two components (NavContainer and Nav)
export function Nav({
  fixturesDir,
  fixtureFileSuffix,
  selectedFixtureId,
  fullScreen,
  rendererConnected,
  fixtures,
  width,
  treeExpansion,
  selectFixture,
  setWidth,
  setTreeExpansion
}: Props) {
  const handleWidthChange = React.useCallback(
    (newWidth: number) => setWidth(restrictNavWidth(newWidth)),
    [setWidth]
  );
  const dragElRef = useDrag({ value: width, onChange: handleWidthChange });

  if (fullScreen) {
    return null;
  }

  if (!rendererConnected) {
    return <Container style={{ width }} />;
  }

  return (
    <Container data-testid="nav" style={{ width }}>
      <Scrollable>
        <FixtureTree
          fixturesDir={fixturesDir}
          fixtureFileSuffix={fixtureFileSuffix}
          fixtures={fixtures}
          selectedFixtureId={selectedFixtureId}
          treeExpansion={treeExpansion}
          onSelect={fixtureId => selectFixture(fixtureId, false)}
          setTreeExpansion={setTreeExpansion}
        />
      </Scrollable>
      <DragHandle ref={dragElRef} />
    </Container>
  );
}

const Container = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 256px;
  height: 100%;
  background: var(--grey1);
  border-right: 1px solid var(--darkest);
`;

const Scrollable = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  right: -3px;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
`;
