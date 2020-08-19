import React from 'react';
import { KEY_DOWN, KEY_UP } from '../keys';
import { useFocus } from '../useFocus';
import {
  TextContainer,
  TextField,
  TextInputContainer,
  TextMirror,
} from './shared';

export type NumberInputStyles = {
  focusedColor: string;
  focusedBg: string;
  focusedBoxShadow: string;
};

type Props = {
  id?: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  styles: NumberInputStyles;
  onChange: (newValue: number) => unknown;
};

// TODO: Support decimals
export function NumberInput({
  id,
  value,
  minValue = -Infinity,
  maxValue = Infinity,
  styles,
  onChange,
}: Props) {
  const { focused, onFocus, onBlur } = useFocus();

  const trimValue = React.useCallback(
    (rawValue: number) => {
      let validValue = Math.min(maxValue, rawValue);
      validValue = Math.max(minValue, validValue);

      // Don't allow floating point to exceed 6 decimal points.
      // This prevents values like 1463.1000000000001
      if (validValue % 1 > 0) validValue = Number(validValue.toFixed(6));

      return validValue;
    },
    [maxValue, minValue]
  );

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = +e.currentTarget.value;
      if (isFinite(newValue)) {
        onChange(trimValue(newValue));
      }
    },
    [onChange, trimValue]
  );

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Jump value by 100 when CMD is pressed
      // Jump value by 10 when SHIFT is pressed
      // Jump value by 0.1 when ALT is pressed
      // Jump value by 1 by default
      const step = e.metaKey ? 100 : e.shiftKey ? 10 : e.altKey ? 0.1 : 1;

      switch (e.keyCode) {
        case KEY_UP:
          e.preventDefault();
          return onChange(trimValue(value + step));
        case KEY_DOWN:
          e.preventDefault();
          return onChange(trimValue(value - step));
        default:
        // Nada
      }
    },
    [onChange, trimValue, value]
  );

  return (
    <TextInputContainer
      focused={focused}
      focusedBg={styles.focusedBg}
      focusedBoxShadow={styles.focusedBoxShadow}
    >
      <TextContainer>
        <TextMirror minWidth={8} focused={focused}>
          {value}
        </TextMirror>
        <TextField
          rows={1}
          id={id}
          value={value}
          focused={focused}
          color={styles.focusedColor}
          onChange={onInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </TextContainer>
    </TextInputContainer>
  );
}
