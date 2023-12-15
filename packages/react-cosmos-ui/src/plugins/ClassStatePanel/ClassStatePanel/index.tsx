import React from 'react';
import { ClassStateFixtureState } from 'react-cosmos-core';
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
  fixtureState: ClassStateFixtureState | undefined;
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
      {sortFsValueGroups(classStateWithValues).map(fsItem => {
        const strElementId = stringifyElementId(fsItem.elementId);
        return (
          <ComponentClassState
            key={strElementId}
            classStateFsItem={fsItem}
            fixtureExpansion={fixtureExpansion}
            onFixtureStateChange={onFixtureStateChange}
            onElementExpansionChange={onElementExpansionChange}
          />
        );
      })}
    </>
  );
});
