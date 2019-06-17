import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId,
  hasFsValues,
  sortFsValueGroups
} from '../../../shared/ui/valueInputTree';
import { ComponentProps } from './ComponentProps';

type Props = {
  fixtureState: FixtureState;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

export function PropsPanel({
  fixtureState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange
}: Props) {
  if (!fixtureState.props) {
    return null;
  }

  const withProps = fixtureState.props.filter(hasFsValues);
  return (
    <>
      {sortFsValueGroups(withProps).map(fsProps => {
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
}
