import React from 'react';
import styled from 'styled-components';
import { clone, setWith } from 'lodash';
import {
  FixtureStatePrimitiveValueType,
  FixtureStateValue,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';
import { TreeItemValue, RowContainer } from './shared';
import { StringInput } from './StringInput';

type Props = {
  treeId: string;
  values: FixtureStateValues;
  parents: string[];
  item: TreeItemValue;
  itemName: string;
  onValueChange: (values: FixtureStateValues) => unknown;
};

export function ValueInputTreeItem({
  treeId,
  values,
  parents,
  item,
  itemName,
  onValueChange
}: Props) {
  const itemId = getItemId(treeId, parents, itemName);

  const onInputChange = React.useCallback(
    (value: FixtureStatePrimitiveValueType) => {
      const valuePath = getValuePath(itemName, parents);
      const fsValue: FixtureStateValue = { type: 'primitive', value };
      onValueChange(setValueAtPath(values, fsValue, valuePath));
    },
    [itemName, onValueChange, parents, values]
  );

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

  if (typeof item.value === 'string') {
    return (
      <RowContainer style={{ paddingLeft: parents.length * 16 }}>
        <Label htmlFor={itemId}>{itemName}</Label>
        <InputContainer>
          <StringInput
            id={itemId}
            value={item.value}
            onChange={onInputChange}
          />
        </InputContainer>
      </RowContainer>
    );
  }

  // TODO: Different components, no more JSON.parse/stringify
  // Keep value copy locally in case of invalid user input?
  // https://github.com/react-cosmos/react-cosmos/blob/07a8fe65df55337a6f8b72542e0ccd1cd03ec148/packages/react-cosmos-playground2/src/plugins/ControlPanel/ValueInput.tsx
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
              onValueChange(setValueAtPath(values, newValue, valuePath));
            } catch (err) {
              console.warn(`Not a valid JSON value: ${item}`);
              return;
            }
          }}
        />
      </InputContainer>
    </RowContainer>
  );
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

function getItemId(treeId: string, parents: string[], itemName: string) {
  return `${treeId}-${[...parents, itemName].join('-')}`;
}

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
