import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateValues,
  FixtureStateValues2
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
          id="input-state"
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
  fsValues2: FixtureStateValues2
): FixtureStateValues {
  const fsValues1: FixtureStateValues = {};
  Object.keys(fsValues2).forEach(inputName => {
    fsValues1[inputName] = {
      type: fsValues2[inputName].type,
      value: fsValues2[inputName].currentValue
    };
  });
  return fsValues1;
}

function updateValues2WithValues1(
  fixtureState: FixtureState,
  fsValues1: FixtureStateValues
) {
  const prevFsValues = fixtureState.customState || {};
  const fsValues: FixtureStateValues2 = {};
  Object.keys(fsValues1).forEach(inputName => {
    if (!prevFsValues[inputName]) {
      console.warn(`Matching fixture state not value found for "${inputName}"`);
      return;
    }

    // TODO: Support all fixture state values
    const fsValue = fsValues1[inputName];
    if (fsValue.type !== 'primitive') {
      return;
    }

    fsValues[inputName] = {
      ...prevFsValues[inputName],
      currentValue: fsValue.value
    };
  });
  return { ...fixtureState, customState: fsValues };
}

function resetCustomStateValues(fixtureState: FixtureState) {
  const prevFsValues = fixtureState.customState || {};
  const nextFsValues: FixtureStateValues2 = {};
  Object.keys(prevFsValues).forEach(inputName => {
    const fsValue = prevFsValues[inputName];
    nextFsValues[inputName] = {
      ...fsValue,
      currentValue: fsValue.defaultValue
    };
  });

  return { ...fixtureState, customState: nextFsValues };
}

function didValuesChange(fsValues: FixtureStateValues2) {
  return Object.keys(fsValues).every(fsValue =>
    isEqual(fsValues[fsValue].currentValue, fsValues[fsValue].defaultValue)
  );
}
