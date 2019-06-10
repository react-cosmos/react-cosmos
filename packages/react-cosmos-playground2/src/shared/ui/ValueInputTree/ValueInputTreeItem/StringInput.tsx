import React from 'react';
import { Label, InputContainer } from './shared';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (newValue: string) => unknown;
};

// TODO: Handle multiline values
export function StringInput({ id, label, value, onChange }: Props) {
  const onInputChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) =>
      onChange(e.currentTarget.value),
    [onChange]
  );

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <InputContainer>
        <input type="text" id={id} value={value} onChange={onInputChange} />
      </InputContainer>
    </>
  );
}
