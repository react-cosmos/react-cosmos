import React from 'react';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateProps,
  removeFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import styled from 'styled-components';
import {
  OnElementTreeExpansion,
  stringifyElementId,
  TreeExpansionGroup
} from '../shared';
import { ComponentProps } from './ComponentProps';
import { createPropsFsUpdater } from './shared';

type Props = {
  fixtureState: FixtureState;
  treeExpansion: TreeExpansionGroup;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onTreeExpansionChange: OnElementTreeExpansion;
};

export function PropsPanel({
  fixtureState,
  treeExpansion,
  onFixtureStateChange,
  onTreeExpansionChange
}: Props) {
  const onResetValues = React.useCallback(
    (elementId: FixtureElementId) => {
      onFixtureStateChange(
        createPropsFsUpdater(elementId, prevFs =>
          removeFixtureStateProps(prevFs, elementId)
        )
      );
    },
    [onFixtureStateChange]
  );

  if (!fixtureState.props) {
    return null;
  }

  return (
    <Container>
      {sortFsProps(fixtureState.props.filter(hasProps)).map((fsProps, idx) => {
        return (
          <ComponentProps
            key={idx}
            fsProps={fsProps}
            treeExpansion={treeExpansion}
            onFixtureStateChange={onFixtureStateChange}
            onResetValues={onResetValues}
            onTreeExpansionChange={onTreeExpansionChange}
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
  padding: 8px 12px;
`;
