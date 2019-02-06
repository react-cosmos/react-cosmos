import * as React from 'react';
import {
  ComponentFixtureState,
  findCompFixtureState,
  FixtureDecoratorId,
  FixtureState,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import { ValueInput } from './ValueInput';

type Props = {
  fixtureState: FixtureState;
  setFixtureState: (components: ComponentFixtureState[]) => unknown;
};

export class PropsState extends React.Component<Props> {
  render() {
    const { fixtureState } = this.props;
    const { components } = fixtureState;

    if (!components) {
      return null;
    }

    return components.map<React.ReactElement<any>>(
      ({ decoratorId, elPath, componentName, props, state }) => (
        <div key={`${decoratorId}-${elPath}`}>
          <p>
            <strong>{componentName}</strong>
          </p>
          {props && (
            <div>
              <p>Props</p>
              {props.map(({ key, serializable, stringified }) => (
                <ValueInput
                  key={key}
                  id={`${decoratorId}-${elPath}-${key}`}
                  label={key}
                  value={stringified}
                  disabled={!serializable}
                  onChange={this.createPropValueChangeHandler(
                    decoratorId,
                    elPath,
                    key
                  )}
                />
              ))}
            </div>
          )}
          {state && (
            <div>
              <p>State</p>
              {state.map(({ key, serializable, stringified }) => (
                <ValueInput
                  key={key}
                  id={`${decoratorId}-${elPath}-${key}`}
                  label={key}
                  value={stringified}
                  disabled={!serializable}
                  onChange={this.createStateValueChangeHandler(
                    decoratorId,
                    elPath,
                    key
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )
    );
  }

  createPropValueChangeHandler = (
    decoratorId: FixtureDecoratorId,
    elPath: string,
    key: string
  ) => (value: string) => {
    const { fixtureState, setFixtureState } = this.props;
    const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

    if (!compFxState || !compFxState.props) {
      console.warn(`Decorator instance id ${decoratorId} no longer exists`);
      return;
    }

    const { props } = compFxState;
    const components = updateCompFixtureState({
      fixtureState,
      decoratorId,
      elPath,
      props: replaceOrAddItem(props, propVal => propVal.key === key, {
        serializable: true,
        key,
        stringified: value
      })
    });

    setFixtureState(components);
  };

  createStateValueChangeHandler = (
    decoratorId: FixtureDecoratorId,
    elPath: string,
    key: string
  ) => (value: string) => {
    const { fixtureState, setFixtureState } = this.props;
    const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

    if (!compFxState || !compFxState.state) {
      console.warn(`Decorator id ${decoratorId} no longer exists`);
      return;
    }

    const { state } = compFxState;
    const components = updateCompFixtureState({
      fixtureState,
      decoratorId,
      elPath,
      state: replaceOrAddItem(state, stateVal => stateVal.key === key, {
        serializable: true,
        key,
        stringified: value
      })
    });

    setFixtureState(components);
  };
}
