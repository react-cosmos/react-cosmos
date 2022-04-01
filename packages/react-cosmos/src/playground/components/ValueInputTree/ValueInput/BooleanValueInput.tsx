import { blue } from 'chalk';
import React from 'react';
import styled from 'styled-components';
import { lightBlue } from '../../../style/colors.js';
import { Label, ValueDataContainer } from './shared.js';

type Props = {
  id: string;
  name: string;
  data: boolean;
  onChange: (data: boolean) => unknown;
};

export function BooleanValueInput({ id, name, data, onChange }: Props) {
  const onToggle = React.useCallback(() => onChange(!data), [onChange, data]);

  return (
    <>
      <Label title={name} as="span" onClick={onToggle}>
        {name}
      </Label>
      <ValueDataContainer>
        <BooleanButton onClick={onToggle}>
          {data ? 'true' : 'false'}
        </BooleanButton>
      </ValueDataContainer>
    </>
  );
}

const BooleanButton = styled.button`
  height: 24px;
  margin: 0;
  padding: 0 5px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: ${lightBlue};
  font-size: 14px;
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
