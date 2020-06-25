import { isEqual } from 'lodash';
import React, { useCallback } from 'react';
import {
  FixtureState,
  FixtureStateSelect,
  FixtureStateSelects,
  FixtureStateValuePairs,
  FixtureStateValues,
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { IconButton32 } from '../../shared/buttons';
import { RotateCcwIcon } from '../../shared/icons';
import { TreeExpansion } from '../../shared/TreeView';
import {
  Actions,
  Body,
  Container,
  Header,
  Title,
  ValueInputTree,
} from '../../shared/valueInputTree';
import { ExpandCollapseValues } from '../../shared/valueInputTree/ExpandCollapseValues';
import { SelectItem } from './SelectItem';

type Props = {
  fixtureState: FixtureState;
  treeExpansion: TreeExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onTreeExpansionChange: (treeExpansion: TreeExpansion) => unknown;
};

export const ValuesPanel = React.memo(function ClassStatePanel({
  fixtureState,
  treeExpansion,
  onFixtureStateChange,
  onTreeExpansionChange,
}: Props) {
  const handleValueChange = useCallback(
    (newValues: FixtureStateValues) =>
      onFixtureStateChange(prevFsState => updateValues(prevFsState, newValues)),
    [onFixtureStateChange]
  );

  const handleSelectChange = useCallback(
    (selectName: string, fsSelect: FixtureStateSelect) =>
      onFixtureStateChange(prevFsState => ({
        ...prevFsState,
        selects: { ...prevFsState.selects, [selectName]: fsSelect },
      })),
    [onFixtureStateChange]
  );

  const handleValuesReset = React.useCallback(() => {
    onFixtureStateChange(resetValues);
    onFixtureStateChange(resetSelects);
  }, [onFixtureStateChange]);

  const fsValuePairs = fixtureState.values || {};
  const fsSelects = fixtureState.selects || {};

  if (Object.keys(fsValuePairs).length + Object.keys(fsSelects).length === 0)
    return null;

  const values = extractCurrentValuesFromValuePairs(fsValuePairs);

  return (
    <Container>
      <Header>
        <Title label="Values" />
        <Actions>
          <IconButton32
            title="Reset to default values"
            icon={<RotateCcwIcon />}
            disabled={
              areValuesUnchanged(fsValuePairs) && areSelectsUnchanged(fsSelects)
            }
            onClick={handleValuesReset}
          />
          <ExpandCollapseValues
            values={values}
            treeExpansion={treeExpansion}
            onTreeExpansionChange={onTreeExpansionChange}
          />
        </Actions>
      </Header>
      <Body>
        <ValueInputTree
          id="values"
          values={values}
          treeExpansion={treeExpansion}
          onValueChange={handleValueChange}
          onTreeExpansionChange={onTreeExpansionChange}
        />
        {Object.keys(fsSelects).map(selectName => (
          <SelectItem
            key={selectName}
            selectName={selectName}
            fsSelect={fsSelects[selectName]}
            onSelectChange={handleSelectChange}
          />
        ))}
      </Body>
    </Container>
  );
});

function extractCurrentValuesFromValuePairs(
  fsValuePairs: FixtureStateValuePairs
): FixtureStateValues {
  const fsValues: FixtureStateValues = {};
  Object.keys(fsValuePairs).forEach(valueName => {
    fsValues[valueName] = fsValuePairs[valueName].currentValue;
  });
  return fsValues;
}

function updateValues(
  fixtureState: FixtureState,
  fsValues: FixtureStateValues
) {
  const prevValues = fixtureState.values || {};
  const values: FixtureStateValuePairs = {};
  Object.keys(fsValues).forEach(valueName => {
    const fsValue = prevValues[valueName];
    if (!fsValue) {
      console.warn(`Matching fixture state value missing for "${valueName}"`);
      return;
    }
    values[valueName] = { ...fsValue, currentValue: fsValues[valueName] };
  });
  return { ...fixtureState, values };
}

function resetValues(fixtureState: FixtureState) {
  const prevValues = fixtureState.values || {};
  const values: FixtureStateValuePairs = {};
  Object.keys(prevValues).forEach(valueName => {
    const fsValue = prevValues[valueName];
    values[valueName] = { ...fsValue, currentValue: fsValue.defaultValue };
  });
  return { ...fixtureState, values };
}

function areValuesUnchanged(fsValuePairs: FixtureStateValuePairs) {
  return Object.keys(fsValuePairs).every(valueName =>
    isEqual(
      fsValuePairs[valueName].currentValue,
      fsValuePairs[valueName].defaultValue
    )
  );
}

function resetSelects(fixtureState: FixtureState) {
  const prevSelects = fixtureState.selects || {};
  const selects: FixtureStateSelects = {};
  Object.keys(prevSelects).forEach(selectName => {
    const fsSelect = prevSelects[selectName];
    selects[selectName] = { ...fsSelect, currentValue: fsSelect.defaultValue };
  });
  return { ...fixtureState, selects };
}

function areSelectsUnchanged(fsSelects: FixtureStateSelects) {
  return Object.keys(fsSelects).every(selectName =>
    isEqual(
      fsSelects[selectName].currentValue,
      fsSelects[selectName].defaultValue
    )
  );
}
