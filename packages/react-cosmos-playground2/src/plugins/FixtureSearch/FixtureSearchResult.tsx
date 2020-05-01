import React from 'react';
import { FlatFixtureTreeItem } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import {
  blue,
  createGreyColor,
  grey64,
  selectedColors,
} from '../../shared/ui/colors';

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
        <Name selected={active}>{name ? `${fileName} ${name}` : fileName}</Name>
        {parents.length > 0 && <Parents>{parents.join('/')}</Parents>}
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
  color: ${selectedColors(
    createGreyColor(64, 0.64),
    createGreyColor(255, 0.64)
  )};
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;

const Name = styled.span<{ selected: boolean }>`
  color: ${selectedColors(grey64, 'white')};
  font-weight: 500;
`;

const Parents = styled.span`
  padding: 0 0 0 8px;
`;
