import React from 'react';
import { Label, InputContainer } from './shared';

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (newValue: number) => unknown;
};

// TODO: Allow user to enter "" (empty value)
// TODO: Increase/decrease with up/down keys
export function NumberInput({ id, label, value, onChange }: Props) {
  const onInputChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      const newValue = +e.currentTarget.value;
      if (!isNaN(newValue)) {
        onChange(newValue);
      }
    },
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
