import { clone, setWith } from 'lodash-es';
import React from 'react';
import { FixtureStateValue, FixtureStateValues } from 'react-cosmos-core';
import styled from 'styled-components';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { grey248, grey32 } from '../../style/colors.js';
import { TreeView } from '../TreeView.js';
import { ValueInput } from './ValueInput/ValueInput.js';
import { ValueInputDir } from './ValueInputDir.js';
import { createValueTree } from './valueTree.js';

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
  return (
    <Container>
      <TreeView
        node={rootNode}
        expansion={expansion}
        setExpansion={setExpansion}
        renderNode={({ node, name, parents, expanded, onToggle }) => {
          const { data, children } = node;

          if (data.type === 'item') {
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
          }

          if (children) {
            const childKeys = Object.keys(children);
            return (
              <ValueInputDir
                name={name}
                childrenText={getChildrenText(childKeys, data.isArray)}
                disabled={childKeys.length === 0}
                expanded={expanded}
                indentLevel={parents.length}
                onToggle={onToggle}
              />
            );
          } else {
            return null;
          }
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

function getChildrenText(childKeys: string[], isArray: boolean) {
  if (childKeys.length > 0) {
    return isArray ? `[ ${childKeys.length} ]` : `{ ${childKeys.join(', ')} }`;
  } else {
    return isArray ? `[]` : `{}`;
  }
}

const Container = styled.div`
  background: ${grey32};
  color: ${grey248};
`;
