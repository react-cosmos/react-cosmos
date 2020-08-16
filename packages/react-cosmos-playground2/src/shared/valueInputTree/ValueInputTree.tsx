import { clone, setWith } from 'lodash';
import React from 'react';
import {
  FixtureStateValue,
  FixtureStateValues,
} from 'react-cosmos-shared2/fixtureState';
import styled from 'styled-components';
import { grey248, grey32 } from '../colors';
import {
  getTreeNodePath,
  TreeExpansion,
  useTreeExpansionToggle,
} from '../treeExpansion';
import { TreeView } from '../TreeView';
import { ValueInput } from './ValueInput/ValueInput';
import { ValueInputDir } from './ValueInputDir';
import { createValueTree } from './valueTree';

type Props = {
  id: string;
  values: FixtureStateValues;
  expansion: TreeExpansion;
  setExpansion: (expansion: TreeExpansion) => unknown;
  onValueChange: (values: FixtureStateValues) => unknown;
};

export const ValueInputTree = React.memo(function ValueInputTree({
  id,
  values,
  expansion,
  setExpansion,
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
              <ValueInput
                value={data.value}
                name={name}
                id={getInputId(id, parents, name)}
                indentLevel={parents.length}
                onChange={newData =>
                  onValueChange(
                    setValueAtPath(
                      values,
                      { type: 'primitive', data: newData },
                      getValuePath(name, parents)
                    )
                  )
                }
              />
            );

          return (
            children && (
              <ValueInputDir
                name={name}
                childNames={Object.keys(children)}
                expanded={expansion[getTreeNodePath(parents, name)]}
                indentLevel={parents.length}
                onToggle={() => onExpansionToggle(parents, name)}
              />
            )
          );
        }}
      />
    </Container>
  );
});

function getInputId(treeId: string, parents: string[], name: string) {
  return `${treeId}-${[...parents, name].join('-')}`;
}

function getValuePath(valueKey: string, parentKeys: string[]) {
  return [...parentKeys.map(p => `${p}.values`), valueKey].join('.');
}

function setValueAtPath(
  values: FixtureStateValues,
  newValue: FixtureStateValue,
  valuePath: string
) {
  // Inspired by https://github.com/lodash/lodash/issues/1696#issuecomment-328335502
  return setWith(clone(values), valuePath, newValue, clone);
}

const Container = styled.div`
  background: ${grey32};
  color: ${grey248};
`;
