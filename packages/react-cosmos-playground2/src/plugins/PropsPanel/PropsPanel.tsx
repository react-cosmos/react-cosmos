import React from 'react';
import styled from 'styled-components';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateValue,
  findFixtureStateProps,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { ValueInput } from '../../shared/ui';

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
        return (
          <React.Fragment key={`${decoratorId}-${elPath}`}>
            <div>
              <strong>{componentName}</strong> props
            </div>
            {Object.keys(values).map(key => (
              <ValueInput
                key={key}
                id={`${decoratorId}-${elPath}-${key}`}
                valueKey={key}
                value={values[key]}
                onChange={createPropValueChangeHandler(
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

function createPropValueChangeHandler(
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void,
  elementId: FixtureElementId,
  key: string
) {
  return (value: FixtureStateValue) => {
    setFixtureState(prevFixtureState => {
      const fsProps = findFixtureStateProps(prevFixtureState, elementId);
      if (!fsProps) {
        console.warn(`Element id ${elementId} no longer exists`);
        return prevFixtureState;
      }

      const { values } = fsProps;
      return {
        ...prevFixtureState,
        props: updateFixtureStateProps({
          fixtureState: prevFixtureState,
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
