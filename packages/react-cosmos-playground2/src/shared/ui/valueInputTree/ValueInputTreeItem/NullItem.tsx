import React from 'react';
import { ValueContainer, Label, UneditableInput } from './shared';

type Props = {
  id: string;
  label: string;
};

export function NullItem({ id, label }: Props) {
  return (
    <>
      <Label title={label} htmlFor={id}>
        {label}
      </Label>
      <ValueContainer>
        <UneditableInput>
          <em>null</em>
        </UneditableInput>
      </ValueContainer>
    </>
  );
}
