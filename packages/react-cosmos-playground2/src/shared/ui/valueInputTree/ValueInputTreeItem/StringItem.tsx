import React from 'react';
import {
  TextContainer,
  TextField,
  TextInputContainer,
  TextMirror,
  useFocus
} from '../../inputs/shared';
import { ValueContainer, Label } from './shared';

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
          focusedBg="var(--grey1)"
          focusedBoxShadow="0 0 0.5px 1px var(--primary4)"
        >
          <TextContainer>
            <TextMirror minWidth={24} focused={focused}>
              {mirrorText}
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
