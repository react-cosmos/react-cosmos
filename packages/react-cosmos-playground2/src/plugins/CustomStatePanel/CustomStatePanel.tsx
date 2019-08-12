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
  FixtureExpansion,
  Header,
  OnElementExpansionChange,
  Title,
  ValueInputTree
} from '../../shared/ui/valueInputTree';

type Props = {
  fixtureState: FixtureState;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

export const CustomStatePanel = React.memo(function ClassStatePanel({
  fixtureState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange
}: Props) {
  const customStateValues2 = fixtureState.customState || {};
  if (Object.keys(customStateValues2).length === 0) {
    return null;
  }

  const customStateValues1: FixtureStateValues = {};
  Object.keys(customStateValues2).forEach(inputName => {
    customStateValues1[inputName] = {
      type: customStateValues2[inputName].type,
      value: customStateValues2[inputName].currentValue
    };
  });

  function onCustomStateChange(newValues: FixtureStateValues) {
    onFixtureStateChange(prevFsState => {
      const prevCustomStateValues = fixtureState.customState || {};
      const nextCustomStateValues: FixtureStateValues2 = {};
      Object.keys(newValues).forEach(inputName => {
        if (!prevCustomStateValues[inputName]) {
          // TODO: Warn about state inconsistency?
          return;
        }

        // TODO: Support all fixture state values
        const fixtureStateValue = newValues[inputName];
        if (fixtureStateValue.type !== 'primitive') {
          return;
        }

        nextCustomStateValues[inputName] = {
          ...prevCustomStateValues[inputName],
          currentValue: fixtureStateValue.value
        };
      });

      return {
        ...prevFsState,
        customState: nextCustomStateValues
      };
    });
  }

  function onResetValues() {
    onFixtureStateChange(prevFsState => {
      const prevCustomStateValues = fixtureState.customState || {};
      const nextCustomStateValues: FixtureStateValues2 = {};
      Object.keys(prevCustomStateValues).forEach(inputName => {
        const fsValue = prevCustomStateValues[inputName];
        nextCustomStateValues[inputName] = {
          ...fsValue,
          currentValue: fsValue.defaultValue
        };
      });

      return {
        ...prevFsState,
        customState: nextCustomStateValues
      };
    });
  }

  return (
    <Container>
      <Header>
        <Title label="STATE" />
        <Actions>
          <DarkIconButton
            title="Reset to default values"
            icon={<RotateCcwIcon />}
            disabled={Object.keys(customStateValues2).every(fsValue =>
              isEqual(
                customStateValues2[fsValue].currentValue,
                customStateValues2[fsValue].defaultValue
              )
            )}
            onClick={onResetValues}
          />
        </Actions>
      </Header>
      <Body>
        <ValueInputTree
          id="input-state"
          values={customStateValues1}
          treeExpansion={{}}
          onValueChange={onCustomStateChange}
          onTreeExpansionChange={() => {}}
        />
      </Body>
    </Container>
  );
});
