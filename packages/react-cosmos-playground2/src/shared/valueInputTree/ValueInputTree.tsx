import React from 'react';
import { FixtureStateValues } from 'react-cosmos-shared2/fixtureState';
import styled from 'styled-components';
import { grey248, grey32 } from '../colors';
import {
  getTreeNodePath,
  TreeExpansion,
  useTreeExpansionToggle,
} from '../treeExpansion';
import { TreeView } from '../TreeView';
import { ValueInputTreeDir } from './ValueInputTreeDir';
import { ValueInputTreeItem } from './ValueInputTreeItem';
import { createValueTree } from './valueTree';

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
  treeExpansion: expansion,
  onTreeExpansionChange: setExpansion,
  onValueChange,
}: Props) {
  const rootNode = createValueTree(values);
  const onExpansionToggle = useTreeExpansionToggle(expansion, setExpansion);
  return (
    <Container>
      <TreeView
        node={rootNode}
        expansion={expansion}
        renderNode={({ node, name, parents }) => {
          const { data, children } = node;

          if (data.type === 'item')
            return (
              <ValueInputTreeItem
                value={data.value}
                name={name}
                parents={parents}
                treeId={id}
                values={values}
                onValueChange={onValueChange}
              />
            );

          return (
            children && (
              <ValueInputTreeDir
                name={name}
                parents={parents}
                childNames={Object.keys(children)}
                expanded={expansion[getTreeNodePath(parents, name)]}
                onToggle={onExpansionToggle}
              />
            )
          );
        }}
      />
    </Container>
  );
});

const Container = styled.div`
  background: ${grey32};
  color: ${grey248};
`;
