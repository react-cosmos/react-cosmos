import * as React from 'react';
// import { default as memoize } from 'memoize-one';
import {
  FixtureState,
  SetFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { FixtureCapture } from '../FixtureCapture';
import { FixtureContext } from '../FixtureContext';
import { DecoratorType, FixtureContextValue } from '../shared';

type Props = {
  decorators: DecoratorType[];
  children: React.ReactNode;
} & FixtureContextValue;

// IDEA: Maybe open up Fixture component for naming and other customization. Eg.
//   <Fixture name="An interesting state">
//     <Button>Click me</button>
//   </Fixture>
export class FixtureProvider extends React.PureComponent<Props> {
  // Provider value is memoized as an object with reference identity to prevent
  // unintentional renders https://reactjs.org/docs/context.html#caveats
  // getFixtureContextValue = memoize(
  //   (fixtureState: null | FixtureState, setFixtureState: SetFixtureState) => ({
  //     fixtureState,
  //     setFixtureState
  //   })
  // );
  getFixtureContextValue = (
    fixtureState: null | FixtureState,
    setFixtureState: SetFixtureState
  ) => ({
    fixtureState,
    setFixtureState
  });

  render() {
    const { decorators, children, fixtureState, setFixtureState } = this.props;

    return (
      <FixtureContext.Provider
        value={this.getFixtureContextValue(fixtureState, setFixtureState)}
      >
        {getComputedElementTree(decorators, children)}
      </FixtureContext.Provider>
    );
  }
}

function getComputedElementTree(
  decorators: DecoratorType[],
  leaf: React.ReactNode
) {
  const fixtureElement = (
    <FixtureCapture decoratorId="root">{leaf}</FixtureCapture>
  );

  return [...decorators]
    .reverse()
    .reduce(
      (prevElement, Decorator) => <Decorator>{prevElement}</Decorator>,
      fixtureElement
    );
}
