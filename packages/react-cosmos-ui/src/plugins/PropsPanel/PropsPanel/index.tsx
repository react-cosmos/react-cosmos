import React from 'react';
import { FixtureStateProps } from 'react-cosmos-core';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  hasFsValues,
  sortFsValueGroups,
  stringifyElementId,
} from '../../../components/ValueInputTree/index.js';
import { SetFixtureStateProps } from '../shared.js';
import { ComponentProps } from './ComponentProps.js';

type Props = {
  fixtureState: FixtureStateProps[] | undefined;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: SetFixtureStateProps;
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
      {sortFsValueGroups(propsWithValues).map(fsProps => {
        const strElementId = stringifyElementId(fsProps.elementId);
        return (
          <ComponentProps
            key={strElementId}
            fsProps={fsProps}
            fixtureExpansion={fixtureExpansion}
            onFixtureStateChange={onFixtureStateChange}
            onElementExpansionChange={onElementExpansionChange}
          />
        );
      })}
    </>
  );
});
