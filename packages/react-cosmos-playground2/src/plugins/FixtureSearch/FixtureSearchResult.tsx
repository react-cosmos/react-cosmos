import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import {
  removeFixtureNameExtension,
  removeFixtureNameSuffix
} from '../../shared/fixture';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtureId: FixtureId;
  active: boolean;
  onSelect: (fixtureId: FixtureId) => unknown;
};

export function FixtureSearchResult({
  fixturesDir,
  fixtureFileSuffix,
  fixtureId,
  active,
  onSelect
}: Props) {
  const { path, name } = fixtureId;
  const { dirs, fileName } = parseFixturePath(
    path,
    fixturesDir,
    fixtureFileSuffix
  );

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
      {[...dirs, fileName].join(' ')}
      {name !== null && ` ${name}`}
    </Container>
  );
}

function parseFixturePath(
  fixturePath: string,
  fixturesDir: string,
  fixtureFileSuffix: string
) {
  const pathParts = fixturePath.split('/');
  const fileName = getCleanFileName(pathParts.pop()!, fixtureFileSuffix);
  const dirs = pathParts.filter(dir => dir !== fixturesDir);
  return { dirs, fileName };
}

function getCleanFileName(fileName: string, fixtureFileSuffix: string) {
  return removeFixtureNameSuffix(
    removeFixtureNameExtension(fileName),
    fixtureFileSuffix
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
