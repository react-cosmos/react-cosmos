import React from 'react';
import { Label, ValueContainer, UneditableInput } from './shared';

type Props = {
  id: string;
  label: string;
  value: string;
};

export function UnserializableInput({ id, label, value }: Props) {
  return (
    <>
      <Label title={label} htmlFor={id}>
        {label}
      </Label>
      <ValueContainer>
        <UneditableInput title={value}>{value}</UneditableInput>
      </ValueContainer>
    </>
  );
}
