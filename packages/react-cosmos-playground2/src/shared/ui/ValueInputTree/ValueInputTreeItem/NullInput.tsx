import React from 'react';
import { Label, UneditableInput } from './shared';

type Props = {
  id: string;
  label: string;
};

export function NullInput({ id, label }: Props) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <UneditableInput>null</UneditableInput>
    </>
  );
}
