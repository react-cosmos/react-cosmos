import styled from 'styled-components';
import React from 'react';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { StorageSpec } from '../Storage/public';
import { FixtureTree } from './FixtureTree';
import { Draggable } from './Draggable';

type Props = {
  projectId: string;
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  fullScreen: boolean;
  rendererConnected: boolean;
  fixtures: FixtureNamesByPath;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
  storage: StorageSpec['methods'];
};

// TODO: Show overlay over renderer preview while dragging
export function Nav({
  projectId,
  fixturesDir,
  fixtureFileSuffix,
  selectedFixtureId,
  fullScreen,
  rendererConnected,
  fixtures,
  selectFixture,
  storage
}: Props) {
  // TODO: Read previous width from storage
  const [width, setWidth] = React.useState(256);

  if (fullScreen) {
    return null;
  }

  if (!rendererConnected) {
    return <Container />;
  }

  function handleWidthChange(newWidth: number) {
    const validWidth = Math.min(512, Math.max(64, newWidth));
    // TODO: Persist width from storage
    setWidth(validWidth);
  }

  return (
    <Container data-testid="nav" style={{ width }}>
      <Scrollable>
        <FixtureTree
          projectId={projectId}
          fixturesDir={fixturesDir}
          fixtureFileSuffix={fixtureFileSuffix}
          fixtures={fixtures}
          selectedFixtureId={selectedFixtureId}
          onSelect={fixtureId => selectFixture(fixtureId, false)}
          storage={storage}
        />
      </Scrollable>
      <Draggable value={width} onChange={handleWidthChange}>
        <DragHandle />
      </Draggable>
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
