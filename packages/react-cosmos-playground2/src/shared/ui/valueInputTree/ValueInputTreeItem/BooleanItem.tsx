import React from 'react';
import styled from 'styled-components';
import { blue, lightBlue } from '../../colors';
import { Label, ValueContainer } from './shared';

type Props = {
  id: string;
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => unknown;
};

export function BooleanItem({ id, label, value, onChange }: Props) {
  const onToggle = React.useCallback(() => onChange(!value), [onChange, value]);

  return (
    <>
      <Label title={label} as="span" onClick={onToggle}>
        {label}
      </Label>
      <ValueContainer>
        <BooleanButton onClick={onToggle}>
          {value ? 'true' : 'false'}
        </BooleanButton>
      </ValueContainer>
    </>
  );
}

const BooleanButton = styled.button`
  height: 24px;
  margin: 0;
  padding: 0 4px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: ${lightBlue};
  line-height: 24px;
  outline: none;
  user-select: none;

  :focus {
    box-shadow: 0 0 0.5px 1px ${blue};
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;
