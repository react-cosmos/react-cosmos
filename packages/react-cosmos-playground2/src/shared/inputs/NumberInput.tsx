import React, { useEffect, useState } from 'react';
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

export function NumberInput({
  id,
  value,
  minValue = -Infinity,
  maxValue = Infinity,
  styles,
  onChange,
}: Props) {
  const [rawValue, setRawValue] = useState(String(value));
  const { focused, onFocus, onBlur } = useFocus();

  // Reset raw value when value prop changes
  useEffect(() => {
    setRawValue(String(value));
  }, [value]);

  function trim(input: number) {
    let trimmed = Math.min(maxValue, input);
    trimmed = Math.max(minValue, trimmed);

    // Don't allow floating point to exceed 6 decimal points.
    // This prevents values like 1463.1000000000001
    if (trimmed % 1 !== 0) trimmed = Number(trimmed.toFixed(6));

    return trimmed;
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = e.currentTarget.value;

    // Allowed inputs: "", "123", "-123", "-", "123.456", ".456", "."
    if (!input.match(/^(-?[0-9]*|(-?[0-9]+)?\.[0-9]*)$/)) return;

    // Valid numbers are propagated to the parent component immediately, while
    // invalid ones are discarded on blur
    const parsed = parseFloat(input);
    if (isNaN(parsed))
      // Typing an invalid number is temporarily allowed, as it might be part of
      // a valid number that the user is in the process of typing. Eg. A minus
      // sign or a dot.
      return setRawValue(input);

    const trimmed = trim(parsed);
    // Unless the value exceeds the [min,max] bounds and needs to be trimmed,
    // preserve the raw value as is. This allows transitioning from integers to
    // floats. Eg. A "1." raw value is just "1" when parsed, but the dot has
    // to be preserved to be able to input the decimals.
    setRawValue(trimmed === parsed ? input : String(trimmed));
    if (trimmed !== value) onChange(trimmed);
  }

  function handleBlur() {
    onBlur();
    // Reset the raw value. Eg. "1." becomes "1", or an empty raw value is
    // replaced with the current value prop.
    setRawValue(String(value));
  }

  function increment(step: number, direction: -1 | 1) {
    let parsed = parseFloat(rawValue);
    if (isNaN(parsed)) parsed = value;
    onChange(trim(parsed + step * direction));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    function getStep() {
      // Jump value by 100 when CMD is pressed
      // Jump value by 10 when SHIFT is pressed
      // Jump value by 0.1 when ALT is pressed
      // Jump value by 1 by default
      return e.metaKey ? 100 : e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    }

    switch (e.keyCode) {
      case KEY_UP:
        e.preventDefault();
        return increment(getStep(), 1);
      case KEY_DOWN:
        e.preventDefault();
        return increment(getStep(), -1);
    }
  }

  return (
    <TextInputContainer
      focused={focused}
      focusedBg={styles.focusedBg}
      focusedBoxShadow={styles.focusedBoxShadow}
    >
      <TextContainer>
        <TextMirror minWidth={8} focused={focused}>
          {rawValue}
        </TextMirror>
        <TextField
          rows={1}
          id={id}
          value={rawValue}
          focused={focused}
          color={styles.focusedColor}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </TextContainer>
    </TextInputContainer>
  );
}
