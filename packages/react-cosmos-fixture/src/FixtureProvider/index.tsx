import * as React from 'react';
import memoize from 'memoize-one/dist/memoize-one.cjs';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { ReactDecorator } from 'react-cosmos-shared2/react';
import { FixtureContextValue, SetFixtureState } from '../shared';
import { FixtureCapture } from '../FixtureCapture';
import { FixtureContext } from '../FixtureContext';
import { FixtureElement } from './FixtureElement';

type Props = {
  decorators: ReactDecorator[];
  children: React.ReactNode;
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
  decorators: ReactDecorator[],
  leafNode: React.ReactNode
) {
  const fixtureElement = (
    <FixtureCapture decoratorId="root">
      {getFixtureElement(leafNode)}
    </FixtureCapture>
  );

  return [...decorators]
    .reverse()
    .reduce(
      (prevElement, Decorator) => <Decorator>{prevElement}</Decorator>,
      fixtureElement
    );
}

function getFixtureElement(leafNode: React.ReactNode) {
  return typeof leafNode === 'function' ? (
    <FixtureElement ElementType={leafNode} />
  ) : (
    leafNode
  );
}
