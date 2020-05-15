import { clone, setWith } from 'lodash';
import React from 'react';
import {
  FixtureStatePrimitiveValueType,
  FixtureStateValue,
  FixtureStateValues,
} from 'react-cosmos-shared2/fixtureState';
import styled from 'styled-components';
import { TreeItemContainer, TreeItemValue } from '../shared';
import { BooleanItem } from './BooleanItem';
import { NullItem } from './NullItem';
import { NumberItem } from './NumberItem';
import { StringItem } from './StringItem';
import { UndefinedItem } from './UndefinedItem';
import { UnserializableItem } from './UnserializableItem';

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
  onValueChange,
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

  return (
    <TreeItemContainer indentLevel={parents.length}>
      <ItemContainer>
        {getItem(item, itemId, itemName, onInputChange)}
      </ItemContainer>
    </TreeItemContainer>
  );
}

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 28px;
  line-height: 28px;
  padding: 0 0 0 18px;
`;

function getItem(
  item: TreeItemValue,
  id: string,
  label: string,
  onInputChange: (value: FixtureStatePrimitiveValueType) => unknown
) {
  if (item.type === 'unserializable') {
    return <UnserializableItem label={label} value={item.stringifiedValue} />;
  }

  if (typeof item.value === 'string') {
    return (
      <StringItem
        id={id}
        label={label}
        value={item.value}
        onChange={onInputChange}
      />
    );
  }

  if (typeof item.value === 'number') {
    return (
      <NumberItem
        id={id}
        label={label}
        value={item.value}
        onChange={onInputChange}
      />
    );
  }

  if (typeof item.value === 'boolean') {
    return (
      <BooleanItem
        id={id}
        label={label}
        value={item.value}
        onChange={onInputChange}
      />
    );
  }

  if (item.value === null) {
    return <NullItem label={label} />;
  }

  if (item.value === undefined) {
    return <UndefinedItem label={label} />;
  }

  throw new Error(`Invalid primitive value: ${item.value}`);
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
