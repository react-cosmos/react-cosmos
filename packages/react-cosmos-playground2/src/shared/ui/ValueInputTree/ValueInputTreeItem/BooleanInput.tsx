import React from 'react';
import styled from 'styled-components';

type Props = {
  id: string;
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => unknown;
};

export function BooleanInput({ id, label, value, onChange }: Props) {
  const onInputChange = React.useCallback(() => onChange(!value), [
    onChange,
    value
  ]);

  return (
    <Container>
      <LabelText>label</LabelText>
      <input
        type="checkbox"
        name={id}
        checked={value}
        onChange={onInputChange}
      />
    </Container>
  );
}

export const Container = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const LabelText = styled.span`
  flex-shrink: 0;
  display: block;
  max-width: 50%;
  box-sizing: border-box;
  padding: 0 6px 0 0;
  color: var(--grey4);
  font-size: 14px;
  user-select: none;
`;
