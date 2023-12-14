import React from 'react';
import { FixtureStateClassState } from 'react-cosmos-core';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  hasFsValues,
  sortFsValueGroups,
  stringifyElementId,
} from '../../../components/ValueInputTree/index.js';
import { SetFixtureStateClassState } from '../shared.js';
import { ComponentClassState } from './ComponentClassState.js';

type Props = {
  fixtureState: FixtureStateClassState[] | undefined;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: SetFixtureStateClassState;
  onElementExpansionChange: OnElementExpansionChange;
};

export const ClassStatePanel = React.memo(function ClassStatePanel({
  fixtureState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange,
}: Props) {
  if (!fixtureState) {
    return null;
  }

  const classStateWithValues = fixtureState.filter(hasFsValues);
  return (
    <>
      {sortFsValueGroups(classStateWithValues).map(fsClassState => {
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
