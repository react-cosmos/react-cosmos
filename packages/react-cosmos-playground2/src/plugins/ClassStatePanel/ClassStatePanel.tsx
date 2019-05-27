import * as React from 'react';
import { StateUpdater, replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  findFixtureStateClassState,
  updateFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { ValueInput } from '../../shared/ui';
import styled from 'styled-components';

type Props = {
  fixtureState: FixtureState;
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void;
};

// TODO: Get component name from fixtureState.props (Maybe)
export class ClassStatePanel extends React.Component<Props> {
  render() {
    const { fixtureState } = this.props;

    if (!fixtureState.classState) {
      return null;
    }

    return fixtureState.classState.map(({ elementId, values }) => {
      const { decoratorId, elPath } = elementId;
      return (
        <Container key={`${decoratorId}-${elPath}`}>
          <p>State</p>
          <div>
            {values.map(({ key, serializable, stringified }) => (
              <ValueInput
                key={key}
                id={`${decoratorId}-${elPath}-${key}`}
                label={key}
                value={stringified}
                disabled={!serializable}
                onChange={this.createStateValueChangeHandler(elementId, key)}
              />
            ))}
          </div>
        </Container>
      );
    });
  }

  createStateValueChangeHandler = (
    elementId: FixtureElementId,
    key: string
  ) => (value: string) => {
    const { setFixtureState } = this.props;
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
          values: replaceOrAddItem(values, stateVal => stateVal.key === key, {
            serializable: true,
            key,
            stringified: value
          })
        })
      };
    });
  };
}

const Container = styled.div`
  padding: 8px 12px;
`;
