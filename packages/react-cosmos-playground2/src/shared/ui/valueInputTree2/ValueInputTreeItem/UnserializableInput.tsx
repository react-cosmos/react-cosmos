import React from 'react';
import { Label, ValueContainer, UneditableInput } from './shared';

type Props = {
  id: string;
  label: string;
  value: string;
};

export function UnserializableInput({ id, label, value }: Props) {
  return (
    <>
      <Label title={label} htmlFor={id}>
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
