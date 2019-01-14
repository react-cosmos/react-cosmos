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
        {this.getComputedElementTree(decorators, children)}
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

  // NOTE: This is more than an optimization! Computing the element tree on
  // every fixtureState change would cause an infinite update loop
  getComputedElementTree = memoize((decorators: DecoratorType[], leaf: Node) =>
    createComputedElementTree(decorators, leaf)
  );
}

function createComputedElementTree(decorators: DecoratorType[], leaf: Node) {
  const fixtureElement = (
    <FixtureCapture decoratorId="root">{leaf}</FixtureCapture>
  );

  return [...decorators].reverse().reduce((prevElement, Decorator) => {
    // The prevElement isn't set as the current decorator's children directly
    // because it leads to duplication of fixture element prop/state capture.
    // Why? When using <FixtureCapture> inside a decorator it captures
    // children elements too, which would've included the selected fixture
    // (and inner decorators) had we not taken this precaution.
    const NextDecorator = hideChildrenUnderType(prevElement);

    return (
      <Decorator>
        <NextDecorator />
      </Decorator>
    );
  }, fixtureElement);
}

function hideChildrenUnderType(children) {
  const NextDecorator = () => children;
  NextDecorator.cosmosCapture = false;

  return NextDecorator;
}
