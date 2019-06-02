import React from 'react';
import styled from 'styled-components';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateValues,
  findFixtureStateProps,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { ValueInputTree } from '../../shared/ui/ValueInputTree';

type Props = {
  fixtureState: FixtureState;
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void;
};

export function PropsPanel({ fixtureState, setFixtureState }: Props) {
  if (!fixtureState.props) {
    return null;
  }

  return (
    <Container>
      {fixtureState.props.map(({ elementId, componentName, values }) => {
        const { decoratorId, elPath } = elementId;
        const id = elPath ? `${decoratorId}-${elPath}` : decoratorId;
        return (
          <React.Fragment key={id}>
            <div>
              <strong>PROPS</strong> ({componentName})
            </div>
            <ValueInputTree
              id={id}
              values={values}
              onChange={createPropValueChangeHandler(
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

function createPropValueChangeHandler(
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void,
  elementId: FixtureElementId
) {
  return (values: FixtureStateValues) => {
    setFixtureState(prevFs => {
      const fsProps = findFixtureStateProps(prevFs, elementId);
      if (!fsProps) {
        console.warn(`Element id ${elementId} no longer exists`);
        return prevFs;
      }

      return {
        ...prevFs,
        // TOOD: Or resetFixtureStateProps
        props: updateFixtureStateProps({
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
