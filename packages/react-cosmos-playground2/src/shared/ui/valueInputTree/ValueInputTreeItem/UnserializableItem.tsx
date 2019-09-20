import React from 'react';
import { ValueContainer, Label, UneditableInput } from './shared';

type Props = {
  label: string;
  value: string;
};

export function UnserializableItem({ label, value }: Props) {
  return (
    <>
      <Label title={label} disabled>
        {label}
      </Label>
      <ValueContainer>
        <UneditableInput title={value}>
          {trimMultilineValue(value)}
        </UneditableInput>
      </ValueContainer>
    </>
  );
}

function trimMultilineValue(value: string) {
  return value.indexOf(`\n`) !== -1 ? `${value.split(`\n`)[0]}...` : value;
}
