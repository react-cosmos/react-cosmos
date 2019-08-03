import React from 'react';
import { KEY_DOWN, KEY_UP } from '../../keys';
import {
  TextContainer,
  TextField,
  TextInputContainer,
  TextMirror
} from './shared';

type Props = {
  id: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  onChange: (newValue: number) => unknown;
};

export function NumberInput({
  id,
  value,
  minValue = -Infinity,
  maxValue = Infinity,
  onChange
}: Props) {
  const [focused, setFocused] = React.useState(false);
  const onFocus = React.useCallback(() => setFocused(true), []);
  const onBlur = React.useCallback(() => setFocused(false), []);

  const trimValue = React.useCallback(
    (rawValue: number) => {
      let validValue = Math.min(maxValue, rawValue);
      validValue = Math.max(minValue, validValue);
      return validValue;
    },
    [maxValue, minValue]
  );

  const onInputChange = React.useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const newValue = +e.currentTarget.value;
      if (isFinite(newValue)) {
        onChange(trimValue(newValue));
      }
    },
    [onChange, trimValue]
  );

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      switch (e.keyCode) {
        case KEY_UP:
          e.preventDefault();
          return onChange(trimValue(value + 1));
        case KEY_DOWN:
          e.preventDefault();
          return onChange(trimValue(value - 1));
        default:
        // Nada
      }
    },
    [onChange, trimValue, value]
  );

  return (
    <TextInputContainer focused={focused}>
      <TextContainer>
        <TextMirror style={{ opacity: focused ? 0 : 1 }}>{value}</TextMirror>
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
  );
}
