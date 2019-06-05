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
  const onValueChange = React.useCallback(
    (elementId: FixtureElementId, values: FixtureStateValues) => {
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
    },
    [setFixtureState]
  );

  if (!fixtureState.props) {
    return null;
  }

  return (
    <Container>
      {fixtureState.props.map(({ elementId, componentName, values }, idx) => {
        return (
          <React.Fragment key={idx}>
            <div>
              <strong>PROPS</strong> ({componentName})
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
