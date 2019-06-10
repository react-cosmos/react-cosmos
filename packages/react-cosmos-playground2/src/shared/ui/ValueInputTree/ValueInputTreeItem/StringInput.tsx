import React from 'react';
import styled from 'styled-components';
import { Label } from './shared';

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
      <InputContainer focused={focused}>
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
      </InputContainer>
    </>
  );
}

export const InputContainer = styled.div<{ focused: boolean }>`
  margin-top: 2px;
  padding: 2px 4px;
  border-radius: 3px;
  background: ${props => (props.focused ? 'var(--grey1)' : 'transparent')};
`;

export const TextContainer = styled.div`
  position: relative;
`;

const TextField = styled.textarea`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: none;
  color: var(--grey6);
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  outline: none;
  resize: none;
`;

const TextMirror = styled.div`
  min-width: 32px;
  max-width: 192px;
  min-height: 20px;
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  opacity: 0;
`;
