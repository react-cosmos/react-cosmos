import React, { useCallback } from 'react';
import { FixtureStateSelectControl } from 'react-cosmos-shared2/fixtureState';
import { ControlSelectSpec, ControlSlotProps } from 'react-cosmos-shared2/ui';
import { createPlugin } from 'react-plugin';
import { SelectValueInput } from './SelectValueInput';

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

register();
