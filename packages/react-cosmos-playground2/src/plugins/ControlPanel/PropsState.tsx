import * as React from 'react';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateProps,
  FixtureStateClassState,
  findFixtureStateProps,
  updateFixtureStateProps,
  findFixtureStateClassState,
  updateFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import { ValueInput } from './ValueInput';

type Props = {
  fixtureState: FixtureState;
  setFixtureStateProps: (props: FixtureStateProps[]) => unknown;
  setFixtureStateClassState: (classState: FixtureStateClassState[]) => unknown;
};

export class PropsState extends React.Component<Props> {
  render() {
    const { fixtureState } = this.props;
    const { props } = fixtureState;

    if (!props) {
      return null;
    }

    return props.map<React.ReactElement<any>>(
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
    const { fixtureState, setFixtureStateProps } = this.props;
    const fxStateProps = findFixtureStateProps(fixtureState, elementId);

    if (!fxStateProps) {
      console.warn(`Element id ${elementId} no longer exists`);
      return;
    }

    const { values } = fxStateProps;
    setFixtureStateProps(
      updateFixtureStateProps({
        fixtureState,
        elementId,
        values: replaceOrAddItem(values, propVal => propVal.key === key, {
          serializable: true,
          key,
          stringified: value
        })
      })
    );
  };

  createStateValueChangeHandler = (
    elementId: FixtureElementId,
    key: string
  ) => (value: string) => {
    const { fixtureState, setFixtureStateClassState } = this.props;
    const fxStateClassState = findFixtureStateClassState(
      fixtureState,
      elementId
    );

    if (!fxStateClassState) {
      console.warn(`Decorator id ${elementId} no longer exists`);
      return;
    }

    const { values } = fxStateClassState;
    setFixtureStateClassState(
      updateFixtureStateClassState({
        fixtureState,
        elementId,
        values: replaceOrAddItem(values, stateVal => stateVal.key === key, {
          serializable: true,
          key,
          stringified: value
        })
      })
    );
  };
}
