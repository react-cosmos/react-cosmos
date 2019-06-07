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
import { ValueInputTree } from '../../shared/ui/ValueInputTree';

type Props = {
  fixtureState: FixtureState;
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void;
};

export function PropsPanel({ fixtureState, setFixtureState }: Props) {
  const onValueChange = React.useCallback(
    (elementId: FixtureElementId, values: FixtureStateValues) => {
      setFixtureState(
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
    [setFixtureState]
  );

  const onResetValues = React.useCallback(
    (elementId: FixtureElementId) => {
      setFixtureState(
        createPropsFsUpdater(elementId, prevFs =>
          removeFixtureStateProps(prevFs, elementId)
        )
      );
    },
    [setFixtureState]
  );

  if (!fixtureState.props) {
    return null;
  }

  // TODO: Sort by elementId
  return (
    <Container>
      {fixtureState.props.map(({ elementId, componentName, values }, idx) => {
        return (
          <React.Fragment key={idx}>
            <div>
              <strong>PROPS</strong> ({componentName})
              <button onClick={() => onResetValues(elementId)}>reset</button>
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

const Container = styled.div`
  padding: 8px 12px;
`;
