import React from 'react';
import { Label } from './shared';

type Props = {
  id: string;
  label: string;
  value: string;
};

// TODO: Handle multiline values
export function UnserializableInput({ id, label, value }: Props) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      {value}
    </>
  );
}
