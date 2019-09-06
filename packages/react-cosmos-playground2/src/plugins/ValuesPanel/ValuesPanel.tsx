import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateValues,
  FixtureStateValuePairs
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

  const fsValuePairs = fixtureState.values || {};
  if (Object.keys(fsValuePairs).length === 0) {
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
            disabled={didValuesChange(fsValuePairs)}
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
  const prevFsValues = fixtureState.values || {};
  const nextFsValues: FixtureStateValuePairs = {};
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
  const prevFsValuePairs = fixtureState.values || {};
  const nextFsValuePairs: FixtureStateValuePairs = {};
  Object.keys(prevFsValuePairs).forEach(valueName => {
    const fsValue = prevFsValuePairs[valueName];
    nextFsValuePairs[valueName] = {
      ...fsValue,
      currentValue: fsValue.defaultValue
    };
  });
  return { ...fixtureState, values: nextFsValuePairs };
}

function didValuesChange(fsValuePairs: FixtureStateValuePairs) {
  return Object.keys(fsValuePairs).every(valueName =>
    isEqual(
      fsValuePairs[valueName].currentValue,
      fsValuePairs[valueName].defaultValue
    )
  );
}
