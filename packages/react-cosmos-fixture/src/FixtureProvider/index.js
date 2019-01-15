// @flow

import React, { PureComponent } from 'react';
import memoize from 'memoize-one';
import { FixtureCapture } from '../FixtureCapture';
import { FixtureContext } from '../FixtureContext';

import type { Node } from 'react';
import type {
  FixtureState,
  SetFixtureState
} from 'react-cosmos-shared2/fixtureState';
import type { DecoratorType, FixtureContextValue } from '../index.js.flow';

type Props = {
  decorators: DecoratorType[],
  children: Node
} & FixtureContextValue;

// IDEA: Maybe open up Fixture component for naming and other customization. Eg.
//   <Fixture name="An interesting state">
//     <Button>Click me</button>
//   </Fixture>
export class FixtureProvider extends PureComponent<Props> {
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

  // Provider value is memoized as an object with reference identity to prevent
  // unintentional renders https://reactjs.org/docs/context.html#caveats
  getFixtureContextValue = memoize(
    (fixtureState: null | FixtureState, setFixtureState: SetFixtureState) => ({
      fixtureState,
      setFixtureState
    })
  );
}

function getComputedElementTree(decorators: DecoratorType[], leaf: Node) {
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
