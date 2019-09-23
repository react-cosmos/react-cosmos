import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { blue, grey64, selectedColors } from '../../shared/ui/colors';

type Props = {
  cleanFixturePath: string;
  fixtureId: FixtureId;
  active: boolean;
  onSelect: (fixtureId: FixtureId, revealFixture: boolean) => unknown;
};

export function FixtureSearchResult({
  cleanFixturePath,
  fixtureId,
  active,
  onSelect
}: Props) {
  const containerRef = useScrollToActive(cleanFixturePath, active);
  const onClick = React.useCallback(() => onSelect(fixtureId, false), [
    fixtureId,
    onSelect
  ]);

  return (
    <Container ref={containerRef} selected={active} onClick={onClick}>
      {cleanFixturePath}
    </Container>
  );
}

function useScrollToActive(cleanFixturePath: string, active: boolean) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Scroll to results when they become active
  React.useLayoutEffect(() => {
    const containerNode = containerRef.current;
    if (active && containerNode) {
      scrollIntoView(containerNode);
    }
  }, [cleanFixturePath, active]);

  return containerRef;
}

function scrollIntoView(node: HTMLElement) {
  if (typeof node.scrollIntoView === 'function') {
    node.scrollIntoView({ block: 'center' });
  }
}

const Container = styled.div<{ selected: boolean }>`
  padding: 0 24px 0 48px;
  line-height: 32px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  background: ${selectedColors('transparent', blue)};
  color: ${selectedColors(grey64, 'white')};
`;
