import React from 'react';
import {
  Label,
  TextInputContainer,
  TextContainer,
  TextField,
  TextMirror
} from './shared';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (newValue: string) => unknown;
};

export function StringInput({ id, label, value, onChange }: Props) {
  const [focused, setFocused] = React.useState(false);
  const onFocus = React.useCallback(() => setFocused(true), []);
  const onBlur = React.useCallback(() => setFocused(false), []);

  const onInputChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement>) =>
      onChange(e.currentTarget.value),
    [onChange]
  );

  // Mirror textarea behavior and add an extra row after user adds a new line
  const mirrorText = value.replace(/\n$/, `\n `);
  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <TextInputContainer focused={focused}>
        <TextContainer>
          <TextMirror>{mirrorText}</TextMirror>
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
    </>
  );
}
