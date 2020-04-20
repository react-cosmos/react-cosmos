import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureExpansion,
  hasFsValues,
  OnElementExpansionChange,
  sortFsValueGroups,
  stringifyElementId,
} from '../../../shared/ui/valueInputTree';
import { ComponentClassState } from './ComponentClassState';

type Props = {
  fixtureState: FixtureState;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

export const ClassStatePanel = React.memo(function ClassStatePanel({
  fixtureState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange,
}: Props) {
  if (!fixtureState.classState) {
    return null;
  }

  const classStateWithValues = fixtureState.classState.filter(hasFsValues);
  return (
    <>
      {sortFsValueGroups(classStateWithValues).map((fsClassState) => {
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
    </>
  );
});
