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
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
  // @ts-ignore
  if (typeof node.scrollIntoViewIfNeeded === 'function') {
    // @ts-ignore
    node.scrollIntoViewIfNeeded();
  } else if (typeof node.scrollIntoView === 'function') {
    node.scrollIntoView(false);
  }
}

const Container = styled.div<{ active: boolean }>`
  padding: 0 16px;
  line-height: 32px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  user-select: none;
  background: ${props => (props.active ? 'rgba(0, 0, 0, 0.3)' : 'transparent')};
`;
