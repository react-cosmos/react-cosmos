import React from 'react';
import styled from 'styled-components';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateValues,
  findFixtureStateClassState,
  updateFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { ValueInputTree } from '../../shared/ui';

type Props = {
  fixtureState: FixtureState;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
};

// TODO: Get component name from fixtureState.props (or store it in the 1st place)
export function ClassStatePanel({ fixtureState, onFixtureStateChange }: Props) {
  const onValueChange = (
    elementId: FixtureElementId,
    values: FixtureStateValues
  ) => {
    onFixtureStateChange(prevFs => {
      const fsClassState = findFixtureStateClassState(prevFs, elementId);
      if (!fsClassState) {
        console.warn(`Decorator id ${elementId} no longer exists`);
        return prevFs;
      }

      return {
        ...prevFs,
        classState: updateFixtureStateClassState({
          fixtureState: prevFs,
          elementId,
          values
        })
      };
    });
  };

  if (!fixtureState.classState) {
    return null;
  }

  return (
    <Container>
      {fixtureState.classState.map(({ elementId, values }, idx) => {
        return (
          <React.Fragment key={idx}>
            <div>
              <strong>CLASS STATE</strong>
            </div>
            <ValueInputTree
              id={stringifyElementId(elementId)}
              values={values}
              treeExpansion={{}}
              onValueChange={newValues => onValueChange(elementId, newValues)}
              onTreeExpansionChange={() => {}}
            />
          </React.Fragment>
        );
      })}
    </Container>
  );
}

function stringifyElementId(elementId: FixtureElementId) {
  const { decoratorId, elPath } = elementId;
  return elPath ? `${decoratorId}-${elPath}` : decoratorId;
}

const Container = styled.div`
  padding: 8px 12px;
`;
