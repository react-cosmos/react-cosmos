import React from 'react';
import { Label, UneditableInput, ValueDataContainer } from './shared.js';

type Props = {
  name: string;
  data: string;
};

export function UnserializableValueInput({ name, data }: Props) {
  return (
    <>
      <Label title={name} disabled>
        {name}
      </Label>
      <ValueDataContainer>
        <UneditableInput title={data}>
          {trimMultilineValue(data)}
        </UneditableInput>
      </ValueDataContainer>
    </>
  );
}

function trimMultilineValue(data: string) {
  return data.indexOf(`\n`) !== -1 ? `${data.split(`\n`)[0]}...` : data;
}
