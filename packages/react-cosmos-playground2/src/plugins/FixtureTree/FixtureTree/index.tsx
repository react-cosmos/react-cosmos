import React, { RefObject } from 'react';
import { FixtureNode } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { grey32 } from '../../../shared/colors';
import { TreeExpansion, TreeView } from '../../../shared/TreeView';
import { FixtureTreeDir } from './FixtureTreeDir';
import { FixtureTreeItem } from './FixtureTreeItem';

type Props = {
  rootNode: FixtureNode;
  selectedFixtureId: null | FixtureId;
  selectedRef: RefObject<HTMLElement>;
  treeExpansion: TreeExpansion;
  onSelect: (path: FixtureId) => unknown;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export const FixtureTree = React.memo(function FixtureTree({
  rootNode,
  selectedFixtureId,
  selectedRef,
  treeExpansion,
  onSelect,
  setTreeExpansion,
}: Props) {
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
            selectedRef={selectedRef}
            onToggle={onToggle}
          />
        )}
        renderItem={({ parents, item, itemName }) => (
          <FixtureTreeItem
            parents={parents}
            item={item}
            itemName={itemName}
            selectedFixtureId={selectedFixtureId}
            selectedRef={selectedRef}
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
  padding: 0 0 8px 0;
  background: ${grey32};
`;
