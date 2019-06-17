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
import { BlankState } from './BlankState';

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

  // TODO: Move blank state outside PropsPanel and only show it when no
  // controls are available in the control panel
  if (
    fixtureState.props.length === 0 ||
    fixtureState.props.every(
      fsProps => Object.keys(fsProps.values).length === 0
    )
  ) {
    return <BlankState />;
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
