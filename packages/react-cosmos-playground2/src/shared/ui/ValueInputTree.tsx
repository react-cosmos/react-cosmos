import React from 'react';
import { clone, setWith } from 'lodash';
import styled from 'styled-components';
import {
  FixtureElementId,
  FixtureStateValue,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';
import { TreeView, TreeExpansion } from './TreeView';
import { getFixtureStateValueTree } from './valueTree';

type Props = {
  elementId: FixtureElementId;
  values: FixtureStateValues;
  onChange: (
    elementId: FixtureElementId,
    values: FixtureStateValues
  ) => unknown;
};

// TODO: Keep value copy locally in case of invalid user input
export const ValueInputTree = React.memo(function ValueInputTree({
  elementId,
  values,
  onChange
}: Props) {
  const [treeExpansion, setTreeExpansion] = React.useState<TreeExpansion>({});
  const id = createStringId(elementId);
  const rootNode = getFixtureStateValueTree(values);

  return (
    <TreeView
      node={rootNode}
      renderDir={({ node, parents, onToggle }) => {
        const { dirs, items } = node;
        const childNames = [...Object.keys(dirs), ...Object.keys(items)];
        return (
          <RowContainer style={{ paddingLeft: (parents.length - 1) * 16 }}>
            <button disabled={childNames.length === 0} onClick={onToggle}>
              {parents[parents.length - 1]}
              {childNames.length > 0 ? ` { ${childNames.join(', ')} }` : '{}'}
            </button>
          </RowContainer>
        );
      }}
      renderItem={({ parents, item, itemName }) => {
        const itemId = `${id}-${[...parents, itemName].join('-')}`;

        if (item.type === 'unserializable') {
          return (
            <RowContainer style={{ paddingLeft: parents.length * 16 }}>
              <Label htmlFor={itemId}>{itemName}</Label>
              <InputContainer>
                <input
                  id={itemId}
                  type="text"
                  disabled
                  value={item.stringifiedValue}
                />
              </InputContainer>
            </RowContainer>
          );
        }

        return (
          <RowContainer style={{ paddingLeft: parents.length * 16 }}>
            <Label htmlFor={itemId}>{itemName}</Label>
            <InputContainer>
              <input
                type="text"
                id={itemId}
                value={JSON.stringify(item.value)}
                onChange={(e: React.SyntheticEvent<HTMLInputElement>) => {
                  try {
                    const newValue: FixtureStateValue = {
                      type: 'primitive',
                      value: JSON.parse(e.currentTarget.value)
                    };
                    const valuePath = getValuePath(itemName, parents);
                    onChange(
                      elementId,
                      setValueAtPath(values, newValue, valuePath)
                    );
                  } catch (err) {
                    console.warn(`Not a valid JSON value: ${item}`);
                    return;
                  }
                }}
              />
            </InputContainer>
          </RowContainer>
        );
      }}
      treeExpansion={treeExpansion}
      onTreeExpansionChange={setTreeExpansion}
    />
  );
});

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

function createStringId(elementId: FixtureElementId) {
  const { decoratorId, elPath } = elementId;
  return elPath ? `${decoratorId}-${elPath}` : decoratorId;
}

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 8px 0;
`;

const Label = styled.label`
  flex-shrink: 0;
  display: block;
  max-width: 50%;
  box-sizing: border-box;
  padding: 0 6px 0 0;
  font-size: 14px;
`;

const InputContainer = styled.div`
  flex: auto;

  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
  }
`;
