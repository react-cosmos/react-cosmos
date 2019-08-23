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

type Props = {
  fixtureState: FixtureState;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
};

export const CustomStatePanel = React.memo(function ClassStatePanel({
  fixtureState,
  onFixtureStateChange
}: Props) {
  const onCustomStateChange = React.useCallback(
    newValues => {
      onFixtureStateChange(prevFsState =>
        updateValues2WithValues1(prevFsState, newValues)
      );
    },
    [onFixtureStateChange]
  );

  const onResetValues = React.useCallback(() => {
    onFixtureStateChange(resetCustomStateValues);
  }, [onFixtureStateChange]);

  const fsValues = fixtureState.customState || {};
  if (Object.keys(fsValues).length === 0) {
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
            disabled={didValuesChange(fsValues)}
            onClick={onResetValues}
          />
        </Actions>
      </Header>
      <Body>
        <ValueInputTree
          id="custom-state"
          values={convertValues2ToValues1(fsValues)}
          treeExpansion={{}}
          onValueChange={onCustomStateChange}
          onTreeExpansionChange={() => {}}
        />
      </Body>
    </Container>
  );
});

function convertValues2ToValues1(
  fsValues2: FixtureStateValueGroups
): FixtureStateValues {
  const fsValues1: FixtureStateValues = {};
  Object.keys(fsValues2).forEach(inputName => {
    fsValues1[inputName] = fsValues2[inputName].currentValue;
  });
  return fsValues1;
}

function updateValues2WithValues1(
  fixtureState: FixtureState,
  fsValues1: FixtureStateValues
) {
  const prevFsValues = fixtureState.customState || {};
  const nextFsValues: FixtureStateValueGroups = {};
  Object.keys(fsValues1).forEach(inputName => {
    if (!prevFsValues[inputName]) {
      console.warn(`Matching fixture state value not found for "${inputName}"`);
      return;
    }

    // TODO: Support all fixture state value types
    const fsValue = fsValues1[inputName];
    if (fsValue.type !== 'primitive') {
      return;
    }

    nextFsValues[inputName] = {
      ...prevFsValues[inputName],
      currentValue: fsValue
    };
  });
  return { ...fixtureState, customState: nextFsValues };
}

function resetCustomStateValues(fixtureState: FixtureState) {
  const prevFsValues = fixtureState.customState || {};
  const nextFsValues: FixtureStateValueGroups = {};
  Object.keys(prevFsValues).forEach(inputName => {
    const fsValue = prevFsValues[inputName];
    nextFsValues[inputName] = {
      ...fsValue,
      currentValue: fsValue.defaultValue
    };
  });

  return { ...fixtureState, customState: nextFsValues };
}

function didValuesChange(fsValues: FixtureStateValueGroups) {
  return Object.keys(fsValues).every(fsValue =>
    isEqual(fsValues[fsValue].currentValue, fsValues[fsValue].defaultValue)
  );
}
