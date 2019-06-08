import React from 'react';
import styled from 'styled-components';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateValues,
  FixtureStateProps,
  findFixtureStateProps,
  updateFixtureStateProps,
  removeFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import {
  TreeExpansionGroup,
  OnElementTreeExpansion,
  stringifyElementId
} from '../shared';
import { ComponentProps } from './ComponentProps';

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
  const onValueChange = React.useCallback(
    (elementId: FixtureElementId, values: FixtureStateValues) => {
      onFixtureStateChange(
        createPropsFsUpdater(elementId, prevFs =>
          // TODO: Or resetFixtureStateProps
          updateFixtureStateProps({
            fixtureState: prevFs,
            elementId,
            values
          })
        )
      );
    },
    [onFixtureStateChange]
  );

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
      {sortFsProps(fixtureState.props).map((fsProps, idx) => {
        return (
          <ComponentProps
            key={idx}
            fsProps={fsProps}
            treeExpansion={treeExpansion}
            onValueChange={onValueChange}
            onResetValues={onResetValues}
            onTreeExpansionChange={onTreeExpansionChange}
          />
        );
      })}
    </Container>
  );
}

function createPropsFsUpdater(
  elementId: FixtureElementId,
  cb: (prevFs: FixtureState) => FixtureStateProps[]
): StateUpdater<FixtureState> {
  return prevFs => {
    const fsProps = findFixtureStateProps(prevFs, elementId);
    if (!fsProps) {
      console.warn(`Element id ${elementId} no longer exists`);
      return prevFs;
    }

    return {
      ...prevFs,
      props: cb(prevFs)
    };
  };
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
