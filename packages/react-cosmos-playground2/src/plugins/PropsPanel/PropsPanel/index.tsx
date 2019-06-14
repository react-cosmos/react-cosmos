import React from 'react';
import {
  FixtureState,
  FixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import styled from 'styled-components';
import {
  OnElementExpansionChange,
  stringifyElementId,
  FixtureExpansion
} from '../shared';
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

  const withProps = fixtureState.props.filter(hasProps);
  return (
    <Container>
      {sortFsProps(withProps).map(fsProps => {
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
    </Container>
  );
}

function hasProps(fsProps: FixtureStateProps) {
  return Object.keys(fsProps.values).length > 0;
}

function sortFsProps(fsProps: FixtureStateProps[]) {
  // Sort by elementId
  return fsProps
    .slice()
    .sort((props1, props2) =>
      stringifyElementId(props1.elementId).localeCompare(
        stringifyElementId(props2.elementId)
      )
    );
}

const Container = styled.div`
  background: var(--grey2);
  color: var(--grey6);
`;
