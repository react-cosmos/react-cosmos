import React from 'react';
import { Label } from './shared';

type Props = {
  id: string;
  label: string;
};

export function NullInput({ id, label }: Props) {
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      null
    </>
  );
}
