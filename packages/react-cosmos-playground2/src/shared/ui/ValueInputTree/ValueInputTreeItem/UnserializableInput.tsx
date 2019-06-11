import React from 'react';
import { Label, UneditableInput } from './shared';

type Props = {
  id: string;
  label: string;
  value: string;
};

// TODO: Handle multiline values
// TODO: Truncate on small widths
export function UnserializableInput({ id, label, value }: Props) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <UneditableInput>{value}</UneditableInput>
    </>
  );
}
