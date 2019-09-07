import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateValues,
  FixtureStateValuePairs,
  FixtureStateSelects
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { RotateCcwIcon } from '../../shared/icons';
import { DarkIconButton } from '../../shared/ui/buttons';
import {
  Actions,
  Body,
  Container,
  Header,
  Title,
  ValueInputTree
} from '../../shared/ui/valueInputTree';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { SelectItem } from './SelectItem';
import { ItemContainer } from '../../shared/ui/valueInputTree/ValueInputTreeItem';

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
  onTreeExpansionChange
}: Props) {
  const onValueChange = React.useCallback(
    (newValues: FixtureStateValues) => {
      onFixtureStateChange(prevFsState => updateValues(prevFsState, newValues));
    },
    [onFixtureStateChange]
  );

  const onSelectChange = React.useCallback(
    (selectName: string, newValue: string) => {
      onFixtureStateChange(prevFsState =>
        updateSelect(prevFsState, selectName, newValue)
      );
    },
    [onFixtureStateChange]
  );

  const onResetValues = React.useCallback(() => {
    onFixtureStateChange(resetValues);
    onFixtureStateChange(resetSelects);
  }, [onFixtureStateChange]);

  const fsValuePairs = fixtureState.values || {};
  const fsSelects = fixtureState.selects || {};

  if (
    Object.keys(fsValuePairs).length === 0 &&
    Object.keys(fsSelects).length === 0
  ) {
    return null;
  }

  return (
    <Container>
      <Header>
        <Title label="VALUES" />
        <Actions>
          <DarkIconButton
            title="Reset to default values"
            icon={<RotateCcwIcon />}
            disabled={
              areValuesEqual(fsValuePairs) && areSelectsEqual(fsSelects)
            }
            onClick={onResetValues}
          />
        </Actions>
      </Header>
      <Body>
        <ValueInputTree
          id="values"
          values={extractCurrentValuesFromValuePairs(fsValuePairs)}
          treeExpansion={treeExpansion}
          onValueChange={onValueChange}
          onTreeExpansionChange={onTreeExpansionChange}
        />
        {Object.keys(fsSelects).map(selectName => {
          const select = fsSelects[selectName];
          return (
            <ItemContainer key={selectName}>
              <SelectItem
                label={selectName}
                id={`select-${selectName}`}
                options={select.options}
                value={select.currentValue}
                onChange={selectedValue =>
                  onSelectChange(selectName, selectedValue)
                }
              />
            </ItemContainer>
          );
        })}
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

function updateSelect(
  fixtureState: FixtureState,
  selectName: string,
  currentValue: string
) {
  const prevSelects = fixtureState.selects || {};
  const fsSelect = prevSelects[selectName];
  if (!fsSelect) {
    console.warn(`Matching fixture state select missing for "${selectName}"`);
    return fixtureState;
  }
  return {
    ...fixtureState,
    selects: {
      ...prevSelects,
      [selectName]: { ...fsSelect, currentValue }
    }
  };
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

function resetSelects(fixtureState: FixtureState) {
  const prevSelects = fixtureState.selects || {};
  const selects: FixtureStateSelects = {};
  Object.keys(prevSelects).forEach(selectName => {
    const fsSelect = prevSelects[selectName];
    selects[selectName] = { ...fsSelect, currentValue: fsSelect.defaultValue };
  });
  return { ...fixtureState, selects };
}

function areValuesEqual(fsValuePairs: FixtureStateValuePairs) {
  return Object.keys(fsValuePairs).every(valueName =>
    isEqual(
      fsValuePairs[valueName].currentValue,
      fsValuePairs[valueName].defaultValue
    )
  );
}

function areSelectsEqual(fsSelects: FixtureStateSelects) {
  return Object.keys(fsSelects).every(selectName =>
    isEqual(
      fsSelects[selectName].currentValue,
      fsSelects[selectName].defaultValue
    )
  );
}
