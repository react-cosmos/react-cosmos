import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';

type Props = {
  cleanFixturePath: string;
  fixtureId: FixtureId;
  active: boolean;
  onSelect: (fixtureId: FixtureId) => unknown;
};

export function FixtureSearchResult({
  cleanFixturePath,
  fixtureId,
  active,
  onSelect
}: Props) {
  // Scroll to results when they become active
  const elRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const containerNode = elRef.current;
    if (active && containerNode) {
      scrollIntoView(containerNode);
    }
  }, [active]);

  return (
    <Container ref={elRef} active={active} onClick={() => onSelect(fixtureId)}>
      {cleanFixturePath}
    </Container>
  );
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
  cursor: default;
  user-select: none;
  background: ${props => (props.active ? 'var(--accent3)' : 'transparent')};
  color: ${props => (props.active ? 'var(--accent7)' : 'var(--grey2)')};
`;
