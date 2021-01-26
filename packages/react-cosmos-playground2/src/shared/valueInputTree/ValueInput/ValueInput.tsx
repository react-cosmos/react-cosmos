import React from 'react';
import { PrimitiveData } from 'react-cosmos-shared2/fixtureState';
import { ValueInputSlot } from '../../slots/ValueInputSlot';
import { LeafValue, ValueTreeItem } from '../shared';
import { BooleanValueInput } from './BooleanValueInput';
import { NullValueInput } from './NullValueInput';
import { NumberValueInput } from './NumberValueInput';
import { ValueInputContainer } from './shared';
import { StringValueInput } from './StringValueInput';
import { UndefinedValueInput } from './UndefinedValueInput';
import { UnserializableValueInput } from './UnserializableValueInput';

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
      <ValueTreeItem indentLevel={indentLevel}>
        <ValueInputContainer>
          {getInput(id, name, value, onChange)}
        </ValueInputContainer>
      </ValueTreeItem>
    </ValueInputSlot>
  );
}

function getInput(
  id: string,
  name: string,
  value: LeafValue,
  onChange: (newValue: PrimitiveData) => unknown
) {
  if (value.type === 'unserializable')
    return (
      <UnserializableValueInput name={name} data={value.stringifiedData} />
    );

  if (typeof value.data === 'string')
    return (
      <StringValueInput
        id={id}
        name={name}
        data={value.data}
        onChange={onChange}
      />
    );

  if (typeof value.data === 'number')
    return (
      <NumberValueInput
        id={id}
        name={name}
        data={value.data}
        onChange={onChange}
      />
    );

  if (typeof value.data === 'boolean')
    return (
      <BooleanValueInput
        id={id}
        name={name}
        data={value.data}
        onChange={onChange}
      />
    );

  if (value.data === null) return <NullValueInput name={name} />;

  if (value.data === undefined) return <UndefinedValueInput name={name} />;

  throw new Error(`Invalid primitive value: ${value.data}`);
}
