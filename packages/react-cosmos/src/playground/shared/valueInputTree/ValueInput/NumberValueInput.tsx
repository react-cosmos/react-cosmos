import { blue } from 'chalk';
import React from 'react';
import { grey248, grey8 } from '../../../../ui/colors';
import { NumberInput } from '../../inputs/NumberInput';
import { Label, ValueDataContainer } from './shared';

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
          value={data}
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
