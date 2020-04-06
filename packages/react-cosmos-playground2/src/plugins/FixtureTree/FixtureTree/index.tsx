import React from 'react';
import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { grey32 } from '../../../shared/ui/colors';
import { TreeExpansion, TreeView } from '../../../shared/ui/TreeView';
import { FixtureTreeDir } from './FixtureTreeDir';
import { FixtureTreeItem } from './FixtureTreeItem';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureNamesByPath;
  selectedFixtureId: null | FixtureId;
  treeExpansion: TreeExpansion;
  onSelect: (path: FixtureId) => unknown;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export const FixtureTree = React.memo(function FixtureTree({
  fixturesDir,
  fixtureFileSuffix,
  fixtures,
  selectedFixtureId,
  treeExpansion,
  onSelect,
  setTreeExpansion
}: Props) {
  const rootNode = React.useMemo(
    () => createFixtureTree({ fixtures, fixturesDir, fixtureFileSuffix }),
    [fixtures, fixturesDir, fixtureFileSuffix]
  );
  return (
    <Container>
      <TreeView
        node={rootNode}
        treeExpansion={treeExpansion}
        renderDir={({ node, parents, isExpanded, onToggle }) => (
          <FixtureTreeDir
            node={node}
            parents={parents}
            isExpanded={isExpanded}
            selectedFixtureId={selectedFixtureId}
            onToggle={onToggle}
          />
        )}
        renderItem={({ parents, item, itemName }) => (
          <FixtureTreeItem
            parents={parents}
            item={item}
            itemName={itemName}
            selectedFixtureId={selectedFixtureId}
            onSelect={onSelect}
          />
        )}
        onTreeExpansionChange={setTreeExpansion}
      />
    </Container>
  );
});

// Reason for inline-block: https://stackoverflow.com/a/53895622/128816
const Container = styled.div`
  display: inline-block;
  min-width: 100%;
  padding: 8px 0;
  background: ${grey32};
`;
