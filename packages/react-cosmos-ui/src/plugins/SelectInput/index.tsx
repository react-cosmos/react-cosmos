import React, { useCallback } from 'react';
import { SelectInputFixtureState } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { InputSlotProps } from '../../slots/InputSlot.js';
import { SelectValueInput } from './SelectValueInput.js';
import { SelectInputSpec } from './spec.js';

const { plug, register } = createPlugin<SelectInputSpec>({
  name: 'selectInput',
});

type SelectInputSlotProps = InputSlotProps<SelectInputFixtureState>;

plug<SelectInputSlotProps>('input-select', ({ slotProps }) => {
  const { inputName, input, onFixtureStateChange } = slotProps;

  const handleChange = useCallback(
    (selectName: string, updateInput: SelectInputFixtureState) => {
      onFixtureStateChange(prevFs => ({
        ...prevFs,
        [selectName]: updateInput,
      }));
    },
    [onFixtureStateChange]
  );

  return (
    <SelectValueInput
      key={inputName}
      name={inputName}
      input={input}
      onChange={handleChange}
    />
  );
});

export { register };

if (process.env.NODE_ENV !== 'test') register();
