import React from 'react';
import { Label, UneditableInput, ValueDataContainer } from './shared';

type Props = {
  name: string;
};

export function UndefinedValueInput({ name }: Props) {
  return (
    <>
      <Label title={name} disabled>
        {name}
      </Label>
      <ValueDataContainer>
        <UneditableInput>
          <em>undefined</em>
        </UneditableInput>
      </ValueDataContainer>
    </>
  );
}
