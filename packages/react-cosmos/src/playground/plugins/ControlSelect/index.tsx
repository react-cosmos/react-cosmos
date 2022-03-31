import React, { useCallback } from 'react';
import { createPlugin } from 'react-plugin';
import { ControlSlotProps } from '../../../ui/slots/ControlSlot';
import { ControlSelectSpec } from '../../../ui/specs/ControlSelectSpec';
import { FixtureStateSelectControl } from '../../../utils/fixtureState/types';
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
