import React from 'react';
import {
  TextContainer,
  TextField,
  TextInputContainer,
  TextMirror
} from '../../inputs/shared';
import { useFocus } from '../../useFocus';
import { Label, ValueContainer } from './shared';
import { grey8, blue } from '../../colors';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (newValue: string) => unknown;
};

export function StringItem({ id, label, value, onChange }: Props) {
  const { focused, onFocus, onBlur } = useFocus();

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      onChange(e.currentTarget.value),
    [onChange]
  );

  // Mirror textarea behavior and add an extra row after user adds a new line
  const mirrorText = focused ? value.replace(/\n$/, `\n `) : value;
  return (
    <>
      <Label title={label} htmlFor={id}>
        {label}
      </Label>
      <ValueContainer>
        <TextInputContainer
          focused={focused}
          focusedBg={grey8}
          focusedBoxShadow={`0 0 0.5px 1px ${blue}`}
        >
          <TextContainer>
            <TextMirror minWidth={64} focused={focused}>
              {value.length > 0 || focused ? mirrorText : <em>empty</em>}
            </TextMirror>
            <TextField
              rows={1}
              id={id}
              value={value}
              focused={focused}
              color="var(--grey7)"
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
