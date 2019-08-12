import React from 'react';
import {
  FixtureState,
  FixtureStateInputState,
  FixtureStateValue,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId,
  hasFsValues,
  sortFsValueGroups,
  ValueInputTree
} from '../../../shared/ui/valueInputTree';
import { ComponentClassState } from './ComponentClassState';

type Props = {
  fixtureState: FixtureState;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

// TODO: Move input state to separate plugin/component
export const ClassStatePanel = React.memo(function ClassStatePanel({
  fixtureState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange
}: Props) {
  if (!fixtureState.classState && !fixtureState.inputState) {
    return null;
  }
  const withClassState = fixtureState.classState
    ? fixtureState.classState.filter(hasFsValues)
    : [];

  const { inputState = {} } = fixtureState;
  const inputStateCurrentValues: FixtureStateValues = {};
  Object.keys(inputState).forEach(inputName => {
    inputStateCurrentValues[inputName] = inputState[inputName].currentValue;
  });

  function onInputStateChange(newValues: Record<string, FixtureStateValue>) {
    onFixtureStateChange(prevFsState => {
      const prevInputState = fixtureState.inputState || {};
      const newInputState: Record<string, FixtureStateInputState<any>> = {};
      Object.keys(newValues).forEach(inputName => {
        if (!prevInputState[inputName]) {
          // TODO: Warn about state inconsistency?
          return;
        }

        // TODO: Support all fixture state values
        const fixtureStateValue = newValues[inputName];
        if (fixtureStateValue.type !== 'primitive') {
          return;
        }

        newInputState[inputName] = {
          defaultValue: prevInputState[inputName].defaultValue,
          currentValue: {
            ...prevInputState[inputName].currentValue,
            value: fixtureStateValue.value
          }
        };
      });

      return {
        ...prevFsState,
        inputState: newInputState
      };
    });
  }

  return (
    <>
      {sortFsValueGroups(withClassState).map(fsClassState => {
        const strElementId = stringifyElementId(fsClassState.elementId);
        return (
          <ComponentClassState
            key={strElementId}
            fsClassState={fsClassState}
            fixtureExpansion={fixtureExpansion}
            onFixtureStateChange={onFixtureStateChange}
            onElementExpansionChange={onElementExpansionChange}
          />
        );
      })}
      <ValueInputTree
        id="input-state"
        values={inputStateCurrentValues}
        treeExpansion={{}}
        onValueChange={onInputStateChange}
        onTreeExpansionChange={() => {}}
      />
    </>
  );
});
