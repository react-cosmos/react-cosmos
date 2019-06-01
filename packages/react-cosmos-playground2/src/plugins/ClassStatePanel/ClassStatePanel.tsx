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
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void;
};

// TODO: Get component name from fixtureState.props (Maybe)
export function ClassStatePanel({ fixtureState, setFixtureState }: Props) {
  if (!fixtureState.classState) {
    return null;
  }

  return (
    <Container>
      {fixtureState.classState.map(({ elementId, values }) => {
        const { decoratorId, elPath } = elementId;
        const id = elPath ? `${decoratorId}-${elPath}` : decoratorId;
        return (
          <React.Fragment key={id}>
            <div>
              <strong>CLASS STATE</strong>
            </div>
            <ValueInputTree
              id={id}
              values={values}
              onChange={createStateValueChangeHandler(
                setFixtureState,
                elementId
              )}
            />
          </React.Fragment>
        );
      })}
    </Container>
  );
}

function createStateValueChangeHandler(
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void,
  elementId: FixtureElementId
) {
  return (values: FixtureStateValues) => {
    setFixtureState(prevFs => {
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
}

const Container = styled.div`
  padding: 8px 12px;
`;
