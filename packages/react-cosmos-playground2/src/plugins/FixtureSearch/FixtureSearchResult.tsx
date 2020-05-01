import React from 'react';
import { FlatFixtureTreeItem } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { blue, grey64, selectedColors } from '../../shared/ui/colors';

type Props = {
  active: boolean;
  cleanFixturePath: string;
  fixtureItem: FlatFixtureTreeItem;
  onSelect: (fixtureId: FixtureId, revealFixture: boolean) => unknown;
};

export function FixtureSearchResult({
  active,
  cleanFixturePath,
  fixtureItem,
  onSelect,
}: Props) {
  const { fixtureId, fileName, name, parents } = fixtureItem;

  const containerRef = useScrollToActive(cleanFixturePath, active);
  const onClick = React.useCallback(() => onSelect(fixtureId, false), [
    fixtureId,
    onSelect,
  ]);

  return (
    <Container ref={containerRef} selected={active} onClick={onClick}>
      <Text>
        <FixtureName>{name ? `${fileName} ${name}` : fileName}</FixtureName>
        {parents.length > 0 && <FixturePath>{parents.join(' ')}</FixturePath>}
      </Text>
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
  background: ${selectedColors('transparent', blue)};
  color: ${selectedColors(grey64, 'white')};
`;

const Text = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow: hidden;
  user-select: none;
`;

const FixtureName = styled.div`
  font-size: 14px;
  line-height: 32px;
  white-space: nowrap;
`;

const FixturePath = styled.div`
  padding: 0 0 0 8px;
  font-size: 12px;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.64;
`;
