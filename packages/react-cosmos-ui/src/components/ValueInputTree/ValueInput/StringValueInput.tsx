import React, { useEffect, useState } from 'react';
import { useFocus } from '../../../hooks/useFocus.js';
import { blue, grey248, grey8 } from '../../../style/colors.js';
import {
  TextContainer,
  TextField,
  TextInputContainer,
  TextMirror,
} from '../../inputs/shared.js';
import { Label, ValueDataContainer } from './shared.js';

type Props = {
  id: string;
  name: string;
  data: string;
  onChange: (data: string) => unknown;
};

export function StringValueInput({ id, name, data, onChange }: Props) {
  const { focused, onFocus, onBlur } = useFocus();

  // The data state is duplicated locally to solve the jumping cursor bug
  // that occurs in controlled React inputs that don't immediately re-render
  // with the new input value on change (because they await for the parent to
  // propagate the changed value back down).
  // https://github.com/facebook/react/issues/955
  // https://github.com/react-cosmos/react-cosmos/issues/1372
  const [localData, setLocalData] = useState(data);
  useEffect(() => {
    if (!focused) setLocalData(data);
  }, [data, focused]);

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalData(e.currentTarget.value);
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  // Mirror textarea behavior and add an extra row after user adds a new line
  const mirrorText = focused ? localData.replace(/\n$/, `\n `) : localData;
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
              {localData.length > 0 || focused ? mirrorText : <em>empty</em>}
            </TextMirror>
            <TextField
              rows={1}
              id={id}
              value={localData}
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
