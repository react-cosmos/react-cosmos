import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';

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
  const containerRef = useContainerRef(cleanFixturePath, active);
  const onClick = React.useCallback(() => onSelect(fixtureId, false), [
    fixtureId,
    onSelect
  ]);

  return (
    <Container ref={containerRef} active={active} onClick={onClick}>
      {cleanFixturePath}
    </Container>
  );
}

function useContainerRef(cleanFixturePath: string, active: boolean) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect((): ReturnType<React.EffectCallback> => {
    const containerNode = containerRef.current;
    if (active && containerNode) {
      const timeoutId = setTimeout(() => scrollIntoView(containerNode), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [cleanFixturePath, active]);

  return containerRef;
}

function scrollIntoView(node: HTMLElement) {
  if (typeof node.scrollIntoView === 'function') {
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

const Container = styled.div<{ active: boolean }>`
  padding: 0 24px 0 48px;
  line-height: 32px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  background: ${props => (props.active ? 'var(--accent3)' : 'transparent')};
  color: ${props => (props.active ? 'var(--accent7)' : 'var(--grey2)')};
`;
