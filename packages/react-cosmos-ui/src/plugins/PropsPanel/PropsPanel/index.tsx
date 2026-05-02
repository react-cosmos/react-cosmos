import React from 'react';
import type { PropsFixtureState } from 'react-cosmos-core';
import type {
  FixtureExpansion,
  OnElementExpansionChange,
} from '../../../components/ValueInputTree/index.js';
import {
  hasFsValues,
  sortFsValueGroups,
  stringifyElementId,
} from '../../../components/ValueInputTree/index.js';
import type { SetPropsFixtureState } from '../shared.js';
import { ComponentProps } from './ComponentProps.js';

type Props = {
  fixtureState: PropsFixtureState | undefined;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: SetPropsFixtureState;
  onElementExpansionChange: OnElementExpansionChange;
};

export const PropsPanel = React.memo(function PropsPanel({
  fixtureState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange,
}: Props) {
  if (!fixtureState) {
    return null;
  }

  const propsWithValues = fixtureState.filter(hasFsValues);
  return (
    <>
      {sortFsValueGroups(propsWithValues).map(fsItem => {
        const strElementId = stringifyElementId(fsItem.elementId);
        return (
          <ComponentProps
            key={strElementId}
            propsFsItem={fsItem}
            fixtureExpansion={fixtureExpansion}
            onFixtureStateChange={onFixtureStateChange}
            onElementExpansionChange={onElementExpansionChange}
          />
        );
      })}
    </>
  );
});
