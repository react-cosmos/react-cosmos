import React from 'react';
import { Label, ValueContainer, UneditableInput } from './shared';

type Props = {
  id: string;
  label: string;
};

export function NullInput({ id, label }: Props) {
  return (
    <>
      <Label title={label} htmlFor={id}>
        {label}
      </Label>
      <ValueContainer>
        <UneditableInput>null</UneditableInput>
      </ValueContainer>
    </>
  );
}
