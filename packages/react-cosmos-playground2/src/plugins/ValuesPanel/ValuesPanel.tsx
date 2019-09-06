import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateValues,
  FixtureStateValueGroups
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
    newValues => {
      onFixtureStateChange(prevFsState => updateValues(prevFsState, newValues));
    },
    [onFixtureStateChange]
  );

  const onResetValues = React.useCallback(() => {
    onFixtureStateChange(resetValues);
  }, [onFixtureStateChange]);

  const fsValueGroups = fixtureState.values || {};
  if (Object.keys(fsValueGroups).length === 0) {
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
            disabled={didValuesChange(fsValueGroups)}
            onClick={onResetValues}
          />
        </Actions>
      </Header>
      <Body>
        <ValueInputTree
          id="values"
          values={extractCurrentValuesFromValueGroups(fsValueGroups)}
          treeExpansion={treeExpansion}
          onValueChange={onValueChange}
          onTreeExpansionChange={onTreeExpansionChange}
        />
      </Body>
    </Container>
  );
});

function extractCurrentValuesFromValueGroups(
  fsValueGroups: FixtureStateValueGroups
): FixtureStateValues {
  const fsValues: FixtureStateValues = {};
  Object.keys(fsValueGroups).forEach(valueName => {
    fsValues[valueName] = fsValueGroups[valueName].currentValue;
  });
  return fsValues;
}

function updateValues(
  fixtureState: FixtureState,
  fsValues: FixtureStateValues
) {
  const prevFsValues = fixtureState.values || {};
  const nextFsValues: FixtureStateValueGroups = {};
  Object.keys(fsValues).forEach(valueName => {
    if (!prevFsValues[valueName]) {
      console.warn(`Matching fixture state value not found for "${valueName}"`);
      return;
    }
    nextFsValues[valueName] = {
      ...prevFsValues[valueName],
      currentValue: fsValues[valueName]
    };
  });
  return { ...fixtureState, values: nextFsValues };
}

function resetValues(fixtureState: FixtureState) {
  const prevFsValueGroups = fixtureState.values || {};
  const nextFsValueGroups: FixtureStateValueGroups = {};
  Object.keys(prevFsValueGroups).forEach(valueName => {
    const fsValue = prevFsValueGroups[valueName];
    nextFsValueGroups[valueName] = {
      ...fsValue,
      currentValue: fsValue.defaultValue
    };
  });
  return { ...fixtureState, values: nextFsValueGroups };
}

function didValuesChange(fsValueGroups: FixtureStateValueGroups) {
  return Object.keys(fsValueGroups).every(valueName =>
    isEqual(
      fsValueGroups[valueName].currentValue,
      fsValueGroups[valueName].defaultValue
    )
  );
}
