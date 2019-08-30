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

export const CustomStatePanel = React.memo(function ClassStatePanel({
  fixtureState,
  treeExpansion,
  onFixtureStateChange,
  onTreeExpansionChange
}: Props) {
  const onCustomStateChange = React.useCallback(
    newValues => {
      onFixtureStateChange(prevFsState =>
        updateCustomState(prevFsState, newValues)
      );
    },
    [onFixtureStateChange]
  );

  const onResetValues = React.useCallback(() => {
    onFixtureStateChange(resetCustomStateValues);
  }, [onFixtureStateChange]);

  const fsValueGroups = fixtureState.customState || {};
  if (Object.keys(fsValueGroups).length === 0) {
    return null;
  }

  return (
    <Container>
      <Header>
        <Title label="STATE" />
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
          id="custom-state"
          values={extractCurrentValuesFromValueGroups(fsValueGroups)}
          treeExpansion={treeExpansion}
          onValueChange={onCustomStateChange}
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

function updateCustomState(
  fixtureState: FixtureState,
  fsValues: FixtureStateValues
) {
  const prevFsValues = fixtureState.customState || {};
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
  return { ...fixtureState, customState: nextFsValues };
}

function resetCustomStateValues(fixtureState: FixtureState) {
  const prevFsValueGroups = fixtureState.customState || {};
  const nextFsValueGroups: FixtureStateValueGroups = {};
  Object.keys(prevFsValueGroups).forEach(valueName => {
    const fsValue = prevFsValueGroups[valueName];
    nextFsValueGroups[valueName] = {
      ...fsValue,
      currentValue: fsValue.defaultValue
    };
  });
  return { ...fixtureState, customState: nextFsValueGroups };
}

function didValuesChange(fsValueGroups: FixtureStateValueGroups) {
  return Object.keys(fsValueGroups).every(valueName =>
    isEqual(
      fsValueGroups[valueName].currentValue,
      fsValueGroups[valueName].defaultValue
    )
  );
}
