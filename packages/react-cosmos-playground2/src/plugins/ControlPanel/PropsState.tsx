import * as React from 'react';
import { StateUpdater, replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  findFixtureStateProps,
  updateFixtureStateProps,
  findFixtureStateClassState,
  updateFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { ValueInput } from './ValueInput';

type Props = {
  fixtureState: FixtureState;
  setFixtureState: (stateUpdater: StateUpdater<FixtureState>) => void;
};

export class PropsState extends React.Component<Props> {
  render() {
    const { fixtureState } = this.props;

    if (!fixtureState.props) {
      return null;
    }

    return fixtureState.props.map<React.ReactElement<any>>(
      ({ elementId, componentName, values }) => {
        const { decoratorId, elPath } = elementId;
        const classState = findFixtureStateClassState(fixtureState, elementId);

        return (
          <div key={`${decoratorId}-${elPath}`}>
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
                  onChange={this.createPropValueChangeHandler(elementId, key)}
                />
              ))}
            </div>
            {classState && (
              <div>
                <p>State</p>
                {classState.values.map(({ key, serializable, stringified }) => (
                  <ValueInput
                    key={key}
                    id={`${decoratorId}-${elPath}-${key}`}
                    label={key}
                    value={stringified}
                    disabled={!serializable}
                    onChange={this.createStateValueChangeHandler(
                      elementId,
                      key
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }
    );
  }

  createPropValueChangeHandler = (elementId: FixtureElementId, key: string) => (
    value: string
  ) => {
    const { setFixtureState } = this.props;
    setFixtureState(fixtureState => {
      const fsProps = findFixtureStateProps(fixtureState, elementId);
      if (!fsProps) {
        console.warn(`Element id ${elementId} no longer exists`);
        return fixtureState;
      }

      const { values } = fsProps;
      return {
        ...fixtureState,
        props: updateFixtureStateProps({
          fixtureState,
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
