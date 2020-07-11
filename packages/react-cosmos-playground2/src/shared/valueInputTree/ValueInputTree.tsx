import React from 'react';
import { FixtureStateValues } from 'react-cosmos-shared2/fixtureState';
import styled from 'styled-components';
import { grey248, grey32 } from '../colors';
import { TreeExpansion, TreeView } from '../TreeView';
import { ValueInputTreeDir } from './ValueInputTreeDir';
import { ValueInputTreeItem } from './ValueInputTreeItem';
import { getFixtureStateValueTree } from './valueTree';

type Props = {
  id: string;
  values: FixtureStateValues;
  treeExpansion: TreeExpansion;
  onValueChange: (values: FixtureStateValues) => unknown;
  onTreeExpansionChange: (treeExpansion: TreeExpansion) => unknown;
};

export const ValueInputTree = React.memo(function ValueInputTree({
  id,
  values,
  treeExpansion,
  onTreeExpansionChange,
  onValueChange,
}: Props) {
  const rootNode = getFixtureStateValueTree(values);
  return (
    <Container>
      <TreeView
        node={rootNode}
        renderDir={({ node, parents, isExpanded, onToggle }) => (
          <ValueInputTreeDir
            node={node}
            parents={parents}
            isExpanded={isExpanded}
            onToggle={onToggle}
          />
        )}
        renderItem={({ parents, item, itemName }) => (
          <ValueInputTreeItem
            treeId={id}
            values={values}
            parents={parents}
            item={item}
            itemName={itemName}
            onValueChange={onValueChange}
          />
        )}
        treeExpansion={treeExpansion}
        onTreeExpansionChange={onTreeExpansionChange}
      />
    </Container>
  );
});

const Container = styled.div`
  background: ${grey32};
  color: ${grey248};
`;
