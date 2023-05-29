import React, { ChangeEvent, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useFocus } from '../../hooks/useFocus.js';
import {
  GroupedOptions,
  isGroupedOptions,
} from '../../shared/groupedOptions.js';
import { blue, grey32 } from '../../style/colors.js';
import { ChevronDownIcon } from '../icons/index.js';

type BaseOption = { value: string; label: string };

type Props<Option extends BaseOption> = {
  id?: string;
  testId?: string;
  options: Option[] | GroupedOptions<Option>[];
  value: string;
  color: string;
  height: number;
  padding: number;
  onChange: (newValue: Option) => unknown;
};

const CUSTOM_LABEL = 'Custom';

export function Select<Option extends BaseOption>({
  id,
  testId,
  options,
  value,
  color,
  height,
  padding,
  onChange,
}: Props<Option>) {
  const { focused, onFocus, onBlur } = useFocus();

  const findOption = useMemo(() => {
    return (list: Option[], targetValue: string) =>
      list.find(o => o.value === targetValue);
  }, []);

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      let option = !isGroupedOptions(options)
        ? findOption(options, e.target.value)
        : undefined;

      if (isGroupedOptions(options)) {
        options.find(group => {
          const foundOption = findOption(group.options, e.target.value);
          if (foundOption) option = foundOption;
        });
      }

      if (!option) {
        throw new Error(`Select value doesn't match any option`);
      }

      console.log({ option });

      onChange(option);
    },
    [findOption, onChange, options]
  );

  const mapOption = useMemo(
    () =>
      (option: Option, idx: number): JSX.Element => {
        return (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        );
      },
    []
  );

  let selectedOption = !isGroupedOptions(options)
    ? findOption(options, value)
    : undefined;

  if (isGroupedOptions(options)) {
    options.find(group => {
      const foundOption = findOption(group.options, value);
      if (foundOption) selectedOption = foundOption;
    });
  }

  const selectedLabel = selectedOption ? selectedOption.label : CUSTOM_LABEL;

  return (
    <Container focused={focused} bg={grey32}>
      <VisibleButton height={height} padding={padding}>
        <Label height={height} color={color}>
          {selectedLabel}
        </Label>
        <IconContainer color={color}>
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
        {isGroupedOptions(options)
          ? options.map((current, groupIdx) => {
              return (
                <optgroup label={current.group} key={groupIdx}>
                  {current.options.map(mapOption)}
                </optgroup>
              );
            })
          : options.map(mapOption)}
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
  overflow: hidden;
`;

const VisibleButton = styled.div<{ height: number; padding: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 ${props => props.padding - 2}px 0 ${props => props.padding}px;
  height: ${props => props.height}px;
`;

const Label = styled.span<{ height: number; color: string }>`
  color: ${props => props.color};
  line-height: ${props => props.height}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const iconSize = 16;

const IconContainer = styled.span<{ color: string }>`
  flex-shrink: 0;
  width: ${iconSize}px;
  height: ${iconSize}px;
  padding: 2px 0 0 2px;
  color: ${props => props.color};
  opacity: 0.7;
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
