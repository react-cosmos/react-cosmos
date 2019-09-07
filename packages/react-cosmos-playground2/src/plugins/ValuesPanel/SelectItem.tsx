import React from 'react';
import styled from 'styled-components';
import { ChevronDownIcon } from '../../shared/icons';
import { useFocus } from '../../shared/ui/useFocus';
import {
  Label,
  ValueContainer
} from '../../shared/ui/valueInputTree/ValueInputTreeItem/shared';

type Props = {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (newValue: string) => unknown;
};

export function SelectItem({ id, label, options, value, onChange }: Props) {
  return (
    <>
      <Label title={label} htmlFor={id}>
        {label}
      </Label>
      <ValueContainer>
        <Select id={id} options={options} value={value} onChange={onChange} />
      </ValueContainer>
    </>
  );
}

type SelectProps = {
  id?: string;
  options: string[];
  value: string;
  onChange: (selectedValue: string) => unknown;
};

// TODO: Unify with shared/ui/inputs/Select?
export function Select({ id, options, value, onChange }: SelectProps) {
  const { focused, onFocus, onBlur } = useFocus();

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <Container focused={focused}>
      <VisibleButton>
        <SelectLabel>{value}</SelectLabel>
        <IconContainer>
          <ChevronDownIcon />
        </IconContainer>
      </VisibleButton>
      <SelectInput
        id={id}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onInputChange}
      >
        {options.map((option, idx) => {
          return (
            <option key={idx} value={option}>
              {option}
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
    props.focused ? '0 0 0.5px 1px var(--primary4)' : 'none'};
`;

const VisibleButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 2px 0 4px;
  height: 24px;
`;

const SelectLabel = styled.span`
  color: var(--grey7);
  line-height: 24px;
`;

const IconContainer = styled.span`
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
