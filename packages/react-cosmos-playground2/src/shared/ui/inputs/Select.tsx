import React from 'react';
import styled from 'styled-components';
import { ChevronDownIcon } from '../../icons';
import { useFocus } from './shared';

type BaseOption = { value: string; label: string };

type Props<Option extends BaseOption> = {
  id?: string;
  testId?: string;
  options: Option[];
  value: string;
  onChange: (newValue: Option) => unknown;
};

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
  const selectedLabel = selectedOption ? selectedOption.label : 'Custom';
  return (
    <Container focused={focused}>
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
        {options.map((option, idx) => {
          const isSelected = value === option.value;
          return (
            <option key={idx} value={option.value} disabled={isSelected}>
              {option.label}
            </option>
          );
        })}
      </SelectInput>
    </Container>
  );
}

const Container = styled.div<{ focused: boolean }>`
  position: relative;
  border-radius: 3px;
  box-shadow: ${props =>
    props.focused ? '0 0 1px 1px var(--primary4)' : 'none'};

  :hover {
    background: hsl(var(--hue-primary), 25%, 95%);
  }
`;

const VisibleButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 6px 0 8px;
  height: 32px;
`;

export const Label = styled.span`
  color: var(--grey2);
  line-height: 32px;
`;

export const IconContainer = styled.span`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  padding: 2px 0 0 2px;
  color: var(--grey3);
`;

const SelectInput = styled.select`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  outline: none;
  opacity: 0;
`;
