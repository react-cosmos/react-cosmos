import React from 'react';
import { Label, InputContainer } from './shared';

type Props = {
  id: string;
  label: string;
};

export function NullInput({ id, label }: Props) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <InputContainer>
        <em>null</em>
      </InputContainer>
    </>
  );
}
