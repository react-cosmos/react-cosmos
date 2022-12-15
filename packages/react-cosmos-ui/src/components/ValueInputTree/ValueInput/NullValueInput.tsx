import React from 'react';
import { Label, UneditableInput, ValueDataContainer } from './shared.js';

type Props = {
  name: string;
};

export function NullValueInput({ name }: Props) {
  return (
    <>
      <Label title={name} disabled>
        {name}
      </Label>
      <ValueDataContainer>
        <UneditableInput>
          <em>null</em>
        </UneditableInput>
      </ValueDataContainer>
    </>
  );
}
