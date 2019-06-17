import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId,
  hasFsValues,
  sortFsValueGroups
} from '../../shared/ui/valueInputTree';
import { ComponentClassState } from './ComponentClassState';

type Props = {
  fixtureState: FixtureState;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

export function ClassStatePanel({
  fixtureState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange
}: Props) {
  if (!fixtureState.classState) {
    return null;
  }

  const withState = fixtureState.classState.filter(hasFsValues);
  return (
    <>
      {sortFsValueGroups(withState).map(fsClassState => {
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
}
