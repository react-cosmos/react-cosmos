import React, { useEffect, useRef } from 'react';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { grey32 } from '../../shared/ui/colors';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { BlankState } from './BlankState';
import { FixtureTree } from './FixtureTree';

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
  const { containerRef, selectedRef } = useScrollToSelected(selectedFixtureId);

  if (!rendererConnected) {
    return <Container />;
  }

  if (Object.keys(fixtures).length === 0) {
    return (
      <Container>
        <BlankState
          fixturesDir={fixturesDir}
          fixtureFileSuffix={fixtureFileSuffix}
        />
      </Container>
    );
  }

  return (
    <Container ref={containerRef}>
      <FixtureTree
        fixturesDir={fixturesDir}
        fixtureFileSuffix={fixtureFileSuffix}
        fixtures={fixtures}
        selectedFixtureId={selectedFixtureId}
        treeExpansion={treeExpansion}
        selectedRef={selectedRef}
        onSelect={selectFixture}
        setTreeExpansion={setTreeExpansion}
      />
    </Container>
  );
}

function useScrollToSelected(selectedFixtureId: FixtureId | null) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { current: selectedEl } = selectedRef;
    const { current: containerEl } = containerRef;
    if (containerEl && selectedEl && !isVisibleInside(selectedEl, containerEl))
      selectedEl.scrollIntoView({ block: 'center' });
  }, [selectedFixtureId]);

  return { containerRef, selectedRef };
}

function isVisibleInside(element: HTMLElement, container: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return (
    containerRect.top < elementRect.top &&
    elementRect.bottom < containerRect.bottom
  );
}

const Container = styled.div`
  flex: 1;
  background: ${grey32};
  overflow: auto;
`;
