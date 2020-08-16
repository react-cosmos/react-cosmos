import React from 'react';
import { blue, grey248, grey8 } from '../../colors';
import {
  TextContainer,
  TextField,
  TextInputContainer,
  TextMirror,
} from '../../inputs/shared';
import { useFocus } from '../../useFocus';
import { Label, ValueDataContainer } from './shared';

type Props = {
  id: string;
  name: string;
  data: string;
  onChange: (data: string) => unknown;
};

export function StringValueInput({ id, name, data, onChange }: Props) {
  const { focused, onFocus, onBlur } = useFocus();

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      onChange(e.currentTarget.value),
    [onChange]
  );

  // Mirror textarea behavior and add an extra row after user adds a new line
  const mirrorText = focused ? data.replace(/\n$/, `\n `) : data;
  return (
    <>
      <Label title={name} htmlFor={id}>
        {name}
      </Label>
      <ValueDataContainer>
        <TextInputContainer
          focused={focused}
          focusedBg={grey8}
          focusedBoxShadow={`0 0 0.5px 1px ${blue}`}
        >
          <TextContainer>
            <TextMirror minWidth={64} focused={focused}>
              {data.length > 0 || focused ? mirrorText : <em>empty</em>}
            </TextMirror>
            <TextField
              rows={1}
              id={id}
              value={data}
              focused={focused}
              color={grey248}
              onChange={onInputChange}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </TextContainer>
        </TextInputContainer>
      </ValueDataContainer>
    </>
  );
}
