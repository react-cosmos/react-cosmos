import { isEqual } from 'lodash';
import React, { RefObject } from 'react';
import {
  FixtureTreeNode,
  getSortedFixureTreeNodeChildNames,
} from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { grey32 } from '../../../shared/colors';
import {
  getTreeNodePath,
  TreeExpansion,
  useTreeExpansionToggle,
} from '../../../shared/treeExpansion';
import { TreeView } from '../../../shared/TreeView';
import { FixtureButton } from './FixtureButton';
import { FixtureDir } from './FixtureDir';

type Props = {
  rootNode: FixtureTreeNode;
  selectedFixtureId: null | FixtureId;
  selectedRef: RefObject<HTMLElement>;
  treeExpansion: TreeExpansion;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
  onSelect: (path: FixtureId) => unknown;
};

// TODO: Rename file to FixtureTree.tsx
export const FixtureTree = React.memo(function FixtureTree({
  rootNode,
  selectedFixtureId,
  selectedRef,
  treeExpansion: expansion,
  setTreeExpansion: setExpansion,
  onSelect,
}: Props) {
  const onExpansionToggle = useTreeExpansionToggle(expansion, setExpansion);
  return (
    <Container>
      <TreeView
        node={rootNode}
        expansion={expansion}
        sortChildren={getSortedFixureTreeNodeChildNames}
        renderNode={({ node, name, parents }) => {
          const { data, children } = node;

          if (data.type === 'fixture')
            return (
              <FixtureButton
                name={name}
                fixtureId={data.fixtureId}
                indentLevel={parents.length}
                selectedFixtureId={selectedFixtureId}
                selectedRef={selectedRef}
                onSelect={onSelect}
              />
            );

          return (
            children && (
              <FixtureDir
                name={name}
                parents={parents}
                expanded={expansion[getTreeNodePath(parents, name)]}
                containsSelectedFixture={
                  selectedFixtureId
                    ? nodesContainFixture(children, selectedFixtureId)
                    : false
                }
                selectedRef={selectedRef}
                onToggle={onExpansionToggle}
              />
            )
          );
        }}
      />
    </Container>
  );
});

function nodesContainFixture(
  nodes: Record<string, FixtureTreeNode>,
  fixtureId: FixtureId
): boolean {
  return Object.keys(nodes).some(childName => {
    const { data, children } = nodes[childName];
    if (data.type === 'fixture') return isEqual(data.fixtureId, fixtureId);
    return children ? nodesContainFixture(children, fixtureId) : false;
  });
}

// Reason for inline-block: https://stackoverflow.com/a/53895622/128816
const Container = styled.div`
  display: inline-block;
  min-width: 100%;
  padding: 0 0 8px 0;
  background: ${grey32};
`;
