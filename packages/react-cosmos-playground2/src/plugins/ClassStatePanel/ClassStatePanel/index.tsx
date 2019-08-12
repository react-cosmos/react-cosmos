import React from 'react';
import {
  FixtureState,
  FixtureStateValue,
  FixtureStateValues,
  FixtureStateValues2
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureExpansion,
  hasFsValues,
  OnElementExpansionChange,
  sortFsValueGroups,
  stringifyElementId,
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
  if (!fixtureState.classState && !fixtureState.customState) {
    return null;
  }
  const withClassState = fixtureState.classState
    ? fixtureState.classState.filter(hasFsValues)
    : [];

  const { customState = {} } = fixtureState;
  const customStateCurrentValues: FixtureStateValues = {};
  Object.keys(customState).forEach(inputName => {
    customStateCurrentValues[inputName] = {
      type: customState[inputName].type,
      value: customState[inputName].currentValue
    };
  });

  function onCustomStateChange(newValues: Record<string, FixtureStateValue>) {
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
        values={customStateCurrentValues}
        treeExpansion={{}}
        onValueChange={onCustomStateChange}
        onTreeExpansionChange={() => {}}
      />
    </>
  );
});
