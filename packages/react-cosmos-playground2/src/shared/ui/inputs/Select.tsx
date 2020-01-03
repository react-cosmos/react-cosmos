import React from 'react';
import styled from 'styled-components';
import { ChevronDownIcon } from '../../icons';
import { blue, grey176, grey248, grey32 } from '../colors';
import { useFocus } from '../useFocus';

type BaseOption = { value: string; label: string };

type Props<Option extends BaseOption> = {
  id?: string;
  testId?: string;
  options: Option[];
  value: string;
  onChange: (newValue: Option) => unknown;
};

const CUSTOM_LABEL = 'Custom';

export function Select<Option extends BaseOption>({
  id,
  testId,
  options,
  value,
  onChange
}: Props<Option>) {
  const { focused, onFocus, onBlur } = useFocus();

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const option = options.find(o => o.value === e.target.value);
      if (!option) {
        throw new Error(`Select value doesn't match any option`);
      }
      onChange(option);
    },
    [onChange, options]
  );

  const selectedOption = options.find(o => o.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : CUSTOM_LABEL;
  return (
    <Container focused={focused} bg={grey32}>
      <VisibleButton>
        <Label>{selectedLabel}</Label>
        <IconContainer>
          <ChevronDownIcon />
        </IconContainer>
      </VisibleButton>
      <SelectInput
        id={id}
        data-testid={testId}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onInputChange}
      >
        {!selectedOption && (
          <option key="custom-option" value={value}>
            {CUSTOM_LABEL}
          </option>
        )}
        {options.map((option, idx) => {
          return (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </SelectInput>
    </Container>
  );
}

type StyledSelectProps = {
  focused: boolean;
  bg: string;
};

const Container = styled.div<StyledSelectProps>`
  position: relative;
  border-radius: 3px;
  background: ${props => props.bg};
  box-shadow: ${props => (props.focused ? `0 0 0.5px 1px ${blue}` : 'none')};
`;

const VisibleButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 6px 0 8px;
  height: 32px;
`;

const Label = styled.span`
  color: ${grey248};
  line-height: 32px;
`;

const iconSize = 16;

const IconContainer = styled.span`
  width: ${iconSize}px;
  height: ${iconSize}px;
  padding: 2px 0 0 2px;
  color: ${grey176};
`;

const SelectInput = styled.select`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  outline: none;
  opacity: 0;
`;
