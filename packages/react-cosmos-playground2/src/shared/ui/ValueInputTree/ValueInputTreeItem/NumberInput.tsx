import React from 'react';
import {
  Label,
  ValueContainer,
  TextInputContainer,
  TextContainer,
  TextField,
  TextMirror
} from './shared';

const KEY_UP = 38;
const KEY_DOWN = 40;

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (newValue: number) => unknown;
};

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

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      switch (e.keyCode) {
        case KEY_UP:
          e.preventDefault();
          return onChange(value + 1);
        case KEY_DOWN:
          e.preventDefault();
          return onChange(value - 1);
        default:
        // Nada
      }
    },
    [value, onChange]
  );

  return (
    <>
      <Label title={label} htmlFor={id}>
        {label}
      </Label>
      <ValueContainer>
        <TextInputContainer focused={focused}>
          <TextContainer>
            <TextMirror style={{ opacity: focused ? 0 : 1 }}>
              {value}
            </TextMirror>
            <TextField
              rows={1}
              id={id}
              value={value}
              onChange={onInputChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              style={{ opacity: focused ? 1 : 0 }}
            />
          </TextContainer>
        </TextInputContainer>
      </ValueContainer>
    </>
  );
}
