import React from 'react';
import styled from 'styled-components';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateValue,
  findFixtureStateClassState,
  updateFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { ValueInput } from '../../shared/ui';

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
        return (
          <React.Fragment key={`${decoratorId}-${elPath}`}>
            <div>State</div>
            {Object.keys(values).map(key => (
              <ValueInput
                key={key}
                id={`${decoratorId}-${elPath}-${key}`}
                valueKey={key}
                value={values[key]}
                onChange={createStateValueChangeHandler(
                  setFixtureState,
                  elementId,
                  key
                )}
              />
            ))}
          </React.Fragment>
        );
      })}
    </Container>
  );
}

function createStateValueChangeHandler(
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void,
  elementId: FixtureElementId,
  key: string
) {
  return (value: FixtureStateValue) => {
    setFixtureState(fixtureState => {
      const fsClassState = findFixtureStateClassState(fixtureState, elementId);
      if (!fsClassState) {
        console.warn(`Decorator id ${elementId} no longer exists`);
        return fixtureState;
      }

      const { values } = fsClassState;
      return {
        ...fixtureState,
        classState: updateFixtureStateClassState({
          fixtureState,
          elementId,
          values: {
            ...values,
            [key]: value
          }
        })
      };
    });
  };
}

const Container = styled.div`
  padding: 8px 12px;
`;
