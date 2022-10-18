import React, { useCallback } from 'react';
import { createPlugin } from 'react-plugin';
import { FixtureStateSelectControl } from 'react-cosmos-core/fixtureState';
import { ControlSlotProps } from '../../slots/ControlSlot.js';
import { SelectValueInput } from './SelectValueInput.js';
import { ControlSelectSpec } from './spec.js';

const { plug, register } = createPlugin<ControlSelectSpec>({
  name: 'controlSelect',
});

type SelectControlSlotProps = ControlSlotProps<FixtureStateSelectControl>;

plug<SelectControlSlotProps>('control-select', ({ slotProps }) => {
  const { controlName, control, onFixtureStateChange } = slotProps;

  const handleChange = useCallback(
    (selectName: string, updatedControl: FixtureStateSelectControl) => {
      onFixtureStateChange(fixtureState => ({
        ...fixtureState,
        controls: {
          ...fixtureState.controls,
          [selectName]: updatedControl,
        },
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
