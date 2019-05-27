import * as React from 'react';
import { StateUpdater, replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  findFixtureStateProps,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { ValueInput } from '../../shared/ui';
import styled from 'styled-components';

type Props = {
  fixtureState: FixtureState;
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void;
};

export function PropsPanel({ fixtureState, setFixtureState }: Props) {
  const createPropValueChangeHandler = (
    elementId: FixtureElementId,
    key: string
  ) => (value: string) => {
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
          values: replaceOrAddItem(values, propVal => propVal.key === key, {
            serializable: true,
            key,
            stringified: value
          })
        })
      };
    });
  };

  if (!fixtureState.props) {
    return null;
  }

  return (
    <Container>
      {fixtureState.props.map(({ elementId, componentName, values }) => {
        const { decoratorId, elPath } = elementId;
        return (
          <React.Fragment key={`${decoratorId}-${elPath}`}>
            <p>
              <strong>{componentName}</strong>
            </p>
            <div>
              <p>Props</p>
              {values.map(({ key, serializable, stringified }) => (
                <ValueInput
                  key={key}
                  id={`${decoratorId}-${elPath}-${key}`}
                  label={key}
                  value={stringified}
                  disabled={!serializable}
                  onChange={createPropValueChangeHandler(elementId, key)}
                />
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  padding: 8px 12px;
`;
