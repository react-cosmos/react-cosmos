import React from 'react';
import styled from 'styled-components';
import { FixtureStateValues } from 'react-cosmos-shared2/fixtureState';
import { TreeView, TreeExpansion } from '../TreeView';
import { getFixtureStateValueTree } from './valueTree';
import { ValueInputTreeItem } from './ValueInputTreeItem';
import { ValueInputTreeDir } from './ValueInputTreeDir';
import { grey32, grey248 } from '../colors';

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
  onValueChange
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
