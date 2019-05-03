import styled from 'styled-components';
import * as React from 'react';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { TreeExpansion } from '../shared';
import { getFixtureTree } from './fixtureTree';
import { FixtureTreeNode } from './FixtureTreeNode';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureNamesByPath;
  selectedFixtureId: null | FixtureId;
  treeExpansion: TreeExpansion;
  onSelect: (path: FixtureId) => unknown;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export function FixtureTree({
  fixturesDir,
  fixtureFileSuffix,
  fixtures,
  selectedFixtureId,
  treeExpansion,
  onSelect,
  setTreeExpansion
}: Props) {
  const handleToggleExpansion = React.useCallback(
    (nodePath: string, expanded: boolean) =>
      setTreeExpansion({ ...treeExpansion, [nodePath]: expanded }),
    [setTreeExpansion, treeExpansion]
  );
  const rootNode = getFixtureTree({
    fixtures,
    fixturesDir,
    fixtureFileSuffix
  });
  return (
    <Container>
      <FixtureTreeNode
        node={rootNode}
        parents={[]}
        treeExpansion={treeExpansion}
        selectedFixtureId={selectedFixtureId}
        onSelect={onSelect}
        onToggleExpansion={handleToggleExpansion}
      />
    </Container>
  );
}

// Reason for inline-block: https://stackoverflow.com/a/53895622/128816
const Container = styled.div`
  display: inline-block;
  min-width: 100%;
`;
