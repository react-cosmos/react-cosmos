import React, { useCallback } from 'react';
import {
  FixtureState,
  FixtureStateControl,
  FixtureStateSelectControl,
  FixtureStateStandardControl,
  FixtureStateValues,
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { createPlugin } from 'react-plugin';
import { ControlPanelRowSlotProps } from '../../shared/slots/ControlPanelRowSlot';
import { ValueInputTree } from '../../shared/valueInputTree';
import { ValuesPanelSpec } from './public';
import { SelectItem } from './SelectItem';
import { ValuesPanel } from './ValuesPanel';

export const VALUES_TREE_EXPANSION_STORAGE_KEY = 'valuesTreeExpansion';

// TODO: Rename to ControlPanel
const { plug, namedPlug, register } = createPlugin<ValuesPanelSpec>({
  name: 'valuesPanel',
});

namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
  'values',
  ({ slotProps }) => {
    const { fixtureState, onFixtureStateChange } = slotProps;
    return (
      <ValuesPanel
        fixtureState={fixtureState}
        onFixtureStateChange={onFixtureStateChange}
      />
    );
  }
);

export type ControlSlotProps<TControl extends FixtureStateControl> = {
  controlName: string;
  control: TControl;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
};

type StandardControlSlotProps = ControlSlotProps<FixtureStateStandardControl>;

plug<StandardControlSlotProps>('control-standard', ({ slotProps }) => {
  const { controlName, control, onFixtureStateChange } = slotProps;

  // TODO: Is this performant enough?
  const handleValueChange = useCallback(
    (values: FixtureStateValues) => {
      onFixtureStateChange(fixtureState => {
        return {
          ...fixtureState,
          controls: {
            ...fixtureState.controls,
            [controlName]: {
              ...control,
              currentValue: values[controlName],
            },
          },
        };
      });
    },
    [control, controlName, onFixtureStateChange]
  );

  // TODO: treeExpansion/onTreeExpansionChange

  return (
    <ValueInputTree
      id={`controls-${controlName}`}
      values={{ [controlName]: control.currentValue }}
      treeExpansion={{}}
      onValueChange={handleValueChange}
      onTreeExpansionChange={() => {}}
    />
  );
});

type SelectControlSlotProps = ControlSlotProps<FixtureStateSelectControl>;

plug<SelectControlSlotProps>('control-select', ({ slotProps }) => {
  const { controlName, control, onFixtureStateChange } = slotProps;

  const handleSelectChange = useCallback(
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
    <SelectItem
      key={controlName}
      selectName={controlName}
      select={control}
      onSelectChange={handleSelectChange}
    />
  );
});

export { register };
