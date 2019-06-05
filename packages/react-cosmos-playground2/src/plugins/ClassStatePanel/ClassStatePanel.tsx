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
  const onValueChange = React.useCallback(
    (elementId: FixtureElementId, values: FixtureStateValues) => {
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
    },
    [setFixtureState]
  );

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
              elementId={elementId}
              values={values}
              onChange={onValueChange}
            />
          </React.Fragment>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  padding: 8px 12px;
`;
