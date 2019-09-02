import memoize from 'memoize-one/dist/memoize-one.cjs';
import React from 'react';
import {
  FixtureState,
  SetFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { ReactDecorator } from 'react-cosmos-shared2/react';
import { FixtureContext } from '../FixtureContext';
import { getDecoratedFixtureElement } from '../getDecoratedFixtureElement';
import { FixtureContextValue } from '../shared';

type Props = {
  decorators: ReactDecorator[];
  children: React.ReactNode;
  onErrorReset: () => unknown;
} & FixtureContextValue;

// IDEA: Maybe open up Fixture component for naming and other customization. Eg.
//   <Fixture name="An interesting state">
//     <Button>Click me</button>
//   </Fixture>
export class FixtureProvider extends React.PureComponent<Props> {
  // Provider value is memoized as an object with reference identity to prevent
  // unintentional renders https://reactjs.org/docs/context.html#caveats
  getFixtureContextValue = memoize(
    (fixtureState: FixtureState, setFixtureState: SetFixtureState) => ({
      fixtureState,
      setFixtureState
    })
  );

  render() {
    const {
      decorators,
      children,
      fixtureState,
      setFixtureState,
      onErrorReset
    } = this.props;
    const decoratorProps = { fixtureState, setFixtureState, onErrorReset };

    return (
      <FixtureContext.Provider
        value={this.getFixtureContextValue(fixtureState, setFixtureState)}
      >
        {getDecoratedFixtureElement(decorators, children, decoratorProps)}
      </FixtureContext.Provider>
    );
  }
}
