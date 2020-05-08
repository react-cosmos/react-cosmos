import React from 'react';
import { ValueContainer, Label, UneditableInput } from './shared';

type Props = {
  label: string;
};

export function UndefinedItem({ label }: Props) {
  return (
    <>
      <Label title={label} disabled>
        {label}
      </Label>
      <ValueContainer>
        <UneditableInput>
          <em>undefined</em>
        </UneditableInput>
      </ValueContainer>
    </>
  );
}
