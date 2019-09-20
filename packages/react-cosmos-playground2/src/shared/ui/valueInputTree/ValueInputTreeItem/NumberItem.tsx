import React from 'react';
import { NumberInput } from '../../inputs/NumberInput';
import { Label, ValueContainer } from './shared';
import { grey8, blue, grey248 } from '../../colors';

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (newValue: number) => unknown;
};

export function NumberItem({ id, label, value, onChange }: Props) {
  return (
    <>
      <Label title={label} htmlFor={id}>
        {label}
      </Label>
      <ValueContainer>
        <NumberInput
          id={id}
          value={value}
          styles={{
            focusedColor: grey248,
            focusedBg: grey8,
            focusedBoxShadow: `0 0 0.5px 1px ${blue}`
          }}
          onChange={onChange}
        />
      </ValueContainer>
    </>
  );
}
