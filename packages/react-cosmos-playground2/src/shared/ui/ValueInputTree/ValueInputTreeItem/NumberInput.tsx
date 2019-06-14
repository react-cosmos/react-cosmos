import React from 'react';
import {
  Label,
  ValueContainer,
  TextInputContainer,
  TextContainer,
  TextField,
  TextMirror
} from './shared';

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (newValue: number) => unknown;
};

// TODO: Allow user to enter "" (empty value)
// TODO: Increase/decrease with up/down keys
export function NumberInput({ id, label, value, onChange }: Props) {
  const [focused, setFocused] = React.useState(false);
  const onFocus = React.useCallback(() => setFocused(true), []);
  const onBlur = React.useCallback(() => setFocused(false), []);

  const onInputChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const newValue = +e.currentTarget.value;
      if (isFinite(newValue)) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  return (
    <>
      <Label title={label} htmlFor={id}>
        {label}
      </Label>
      <ValueContainer>
        <TextInputContainer focused={focused}>
          <TextContainer>
            <TextMirror>{value}</TextMirror>
            <TextField
              rows={1}
              id={id}
              value={value}
              onChange={onInputChange}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </TextContainer>
        </TextInputContainer>
      </ValueContainer>
    </>
  );
}
