import React from 'react';
import { NumberInput } from '../../inputs/NumberInput';
import { Label, ValueContainer } from './shared';

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
            focusedColor: 'var(--grey7)',
            focusedBg: 'var(--grey1)',
            focusedBoxShadow: '0 0 0.5px 1px var(--primary4)'
          }}
          onChange={onChange}
        />
      </ValueContainer>
    </>
  );
}
