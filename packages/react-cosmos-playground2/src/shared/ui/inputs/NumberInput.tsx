import React from 'react';
import { KEY_DOWN, KEY_UP } from '../../keys';
import {
  TextContainer,
  TextField,
  TextInputContainer,
  TextMirror,
  useFocus
} from './shared';

type Styles = {
  focusedColor: string;
  focusedBg: string;
  focusedBoxShadow: string;
};

type Props = {
  id: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  styles: Styles;
  onChange: (newValue: number) => unknown;
};

// TODO: Support decimals
export function NumberInput({
  id,
  value,
  minValue = -Infinity,
  maxValue = Infinity,
  styles,
  onChange
}: Props) {
  const { focused, onFocus, onBlur } = useFocus();

  const trimValue = React.useCallback(
    (rawValue: number) => {
      let validValue = Math.min(maxValue, rawValue);
      validValue = Math.max(minValue, validValue);
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
