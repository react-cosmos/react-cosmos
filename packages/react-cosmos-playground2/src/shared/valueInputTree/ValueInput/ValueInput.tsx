import React from 'react';
import { PrimitiveData } from 'react-cosmos-shared2/fixtureState';
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
  id: string;
  indentLevel: number;
  onChange: (data: PrimitiveData) => unknown;
};

export function ValueInput({ value, name, id, indentLevel, onChange }: Props) {
  return (
    <ValueInputSlot slotProps={{ id, name, value, indentLevel, onChange }}>
      <TreeItemContainer indentLevel={indentLevel}>
        <ItemContainer>{getItem(id, name, value, onChange)}</ItemContainer>
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
  onChange: (value: PrimitiveData) => unknown
) {
  if (value.type === 'unserializable')
    return <UnserializableItem label={name} value={value.stringifiedData} />;

  if (typeof value.data === 'string')
    return (
      <StringItem id={id} label={name} value={value.data} onChange={onChange} />
    );

  if (typeof value.data === 'number')
    return (
      <NumberItem id={id} label={name} value={value.data} onChange={onChange} />
    );

  if (typeof value.data === 'boolean')
    return (
      <BooleanItem
        id={id}
        label={name}
        value={value.data}
        onChange={onChange}
      />
    );

  if (value.data === null) return <NullItem label={name} />;

  if (value.data === undefined) return <UndefinedItem label={name} />;

  throw new Error(`Invalid primitive value: ${value.data}`);
}
