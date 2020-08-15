import { clone, setWith } from 'lodash';
import React from 'react';
import {
  FixtureStateValue,
  FixtureStateValues,
  PrimitiveData,
} from 'react-cosmos-shared2/fixtureState';
import styled from 'styled-components';
import { ValueInputSlot } from '../../slots/ValueInputSlot';
import { LeafValue, TreeItemContainer } from '../shared';
import { BooleanItem } from './BooleanItem';
import { NullItem } from './NullItem';
import { NumberItem } from './NumberItem';
import { StringItem } from './StringItem';
import { UndefinedItem } from './UndefinedItem';
import { UnserializableItem } from './UnserializableItem';

type Props = {
  value: LeafValue;
  name: string;
  parents: string[];
  // TODO: Can this interface be simplified?
  treeId: string;
  values: FixtureStateValues;
  onValueChange: (values: FixtureStateValues) => unknown;
};

export function ValueInputTreeItem({
  value,
  name,
  parents,
  treeId,
  values,
  onValueChange,
}: Props) {
  const id = getItemId(treeId, parents, name);

  const onInputChange = React.useCallback(
    (data: PrimitiveData) => {
      const valuePath = getValuePath(name, parents);
      const fsValue: FixtureStateValue = { type: 'primitive', data };
      onValueChange(setValueAtPath(values, fsValue, valuePath));
    },
    [name, onValueChange, parents, values]
  );

  return (
    <ValueInputSlot slotProps={{ id, name, value, parents, onInputChange }}>
      <TreeItemContainer indentLevel={parents.length}>
        <ItemContainer>{getItem(id, name, value, onInputChange)}</ItemContainer>
      </TreeItemContainer>
    </ValueInputSlot>
  );
}

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 28px;
  line-height: 28px;
  padding: 0 0 0 20px;
`;

function getItem(
  id: string,
  name: string,
  value: LeafValue,
  onInputChange: (value: PrimitiveData) => unknown
) {
  if (value.type === 'unserializable')
    return <UnserializableItem label={name} value={value.stringifiedData} />;

  if (typeof value.data === 'string')
    return (
      <StringItem
        id={id}
        label={name}
        value={value.data}
        onChange={onInputChange}
      />
    );

  if (typeof value.data === 'number')
    return (
      <NumberItem
        id={id}
        label={name}
        value={value.data}
        onChange={onInputChange}
      />
    );

  if (typeof value.data === 'boolean')
    return (
      <BooleanItem
        id={id}
        label={name}
        value={value.data}
        onChange={onInputChange}
      />
    );

  if (value.data === null) return <NullItem label={name} />;

  if (value.data === undefined) return <UndefinedItem label={name} />;

  throw new Error(`Invalid primitive value: ${value.data}`);
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
