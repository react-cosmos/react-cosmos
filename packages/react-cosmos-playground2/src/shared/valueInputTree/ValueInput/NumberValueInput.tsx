import React from 'react';
import { NumberInput } from '../../inputs/NumberInput';
import { Label, ValueDataContainer } from './shared';
import { grey8, blue, grey248 } from '../../colors';

type Props = {
  id: string;
  name: string;
  data: number;
  onChange: (newValue: number) => unknown;
};

export function NumberValueInput({ id, name, data, onChange }: Props) {
  return (
    <>
      <Label title={name} htmlFor={id}>
        {name}
      </Label>
      <ValueDataContainer>
        <NumberInput
          id={id}
          data={data}
          styles={{
            focusedColor: grey248,
            focusedBg: grey8,
            focusedBoxShadow: `0 0 0.5px 1px ${blue}`,
          }}
          onChange={onChange}
        />
      </ValueDataContainer>
    </>
  );
}
