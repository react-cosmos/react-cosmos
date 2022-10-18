import React from 'react';
import { FixtureState } from 'react-cosmos-core/fixtureState';
import { StateUpdater } from 'react-cosmos-core/utils';
import {
  FixtureExpansion,
  hasFsValues,
  OnElementExpansionChange,
  sortFsValueGroups,
  stringifyElementId,
} from '../../../components/ValueInputTree/index.js';
import { ComponentProps } from './ComponentProps.js';

type Props = {
  fixtureState: FixtureState;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

export const PropsPanel = React.memo(function PropsPanel({
  fixtureState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange,
}: Props) {
  if (!fixtureState.props) {
    return null;
  }

  const propsWithValues = fixtureState.props.filter(hasFsValues);
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
