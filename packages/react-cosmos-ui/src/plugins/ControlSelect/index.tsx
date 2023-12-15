import React, { useCallback } from 'react';
import { SelectControlFixtureState } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { ControlSlotProps } from '../../slots/ControlSlot.js';
import { SelectValueInput } from './SelectValueInput.js';
import { ControlSelectSpec } from './spec.js';

const { plug, register } = createPlugin<ControlSelectSpec>({
  name: 'controlSelect',
});

type SelectControlSlotProps = ControlSlotProps<SelectControlFixtureState>;

plug<SelectControlSlotProps>('control-select', ({ slotProps }) => {
  const { controlName, control, onFixtureStateChange } = slotProps;

  const handleChange = useCallback(
    (selectName: string, updatedControl: SelectControlFixtureState) => {
      onFixtureStateChange(prevFs => ({
        ...prevFs,
        [selectName]: updatedControl,
      }));
    },
    [onFixtureStateChange]
  );

  return (
    <SelectValueInput
      key={controlName}
      name={controlName}
      control={control}
      onChange={handleChange}
    />
  );
});

export { register };

if (process.env.NODE_ENV !== 'test') register();
