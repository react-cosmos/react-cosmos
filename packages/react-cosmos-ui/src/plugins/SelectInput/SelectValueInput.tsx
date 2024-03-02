import React from 'react';
import { SelectInputFixtureState } from 'react-cosmos-core';
import {
  Label,
  ValueDataContainer,
  ValueInputContainer,
} from '../../components/ValueInputTree/ValueInput/shared.js';
import { Select } from '../../components/inputs/Select.js';
import { isGroupedOptions } from '../../shared/groupedOptions.js';
import { lightBlue } from '../../style/colors.js';

type Props = {
  name: string;
  input: SelectInputFixtureState;
  onChange: (name: string, select: SelectInputFixtureState) => unknown;
};

export function SelectValueInput({ name, input, onChange }: Props) {
  const { options, currentValue } = input;
  const id = `select-${name}`;
  return (
    <ValueInputContainer key={name}>
      <Label title={name} htmlFor={id}>
        {name}
      </Label>
      <ValueDataContainer>
        <Select
          id={id}
          options={createSelectOptions(options)}
          value={currentValue}
          color={lightBlue}
          height={24}
          padding={5}
          onChange={newValue =>
            onChange(name, {
              ...input,
              currentValue: newValue.value,
            })
          }
        />
      </ValueDataContainer>
    </ValueInputContainer>
  );
}

function createSelectOptions(options: SelectInputFixtureState['options']) {
  if (isGroupedOptions(options)) {
    return options.map(group => ({
      group: group.group,
      options: group.options.map(option => ({
        value: option,
        label: option,
      })),
    }));
  }

  return options.map(option => ({ value: option, label: option }));
}
