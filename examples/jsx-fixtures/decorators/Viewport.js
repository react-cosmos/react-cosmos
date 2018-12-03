// @flow

import { Component } from 'react';
import { FixtureContext } from 'react-cosmos-fixture';

import type { Node } from 'react';
import type { FixtureContextValue } from 'react-cosmos-fixture';

type Props = {
  children: Node,
  width: number,
  height: number
};

// TODO: Make this a core decorator
export class Viewport extends Component<Props> {
  // TODO: Disable props capture and add width/height (number) controls inside
  // Control Panel. NOTE: There can be only one Viewport decorator per page.
  // static cosmosCapture = false;

  static contextType = FixtureContext;

  // https://github.com/facebook/flow/issues/7166
  context: FixtureContextValue;

  render() {
    return this.props.children;
  }

  componentDidMount() {
    this.updateFixtureStateViewport();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.width !== prevProps.width ||
      this.props.height !== prevProps.height
    ) {
      this.updateFixtureStateViewport();
    }
  }

  updateFixtureStateViewport() {
    const { width, height } = this.props;

    this.context.setFixtureState(fixtureState => {
      return {
        ...fixtureState,
        viewport: { width, height }
      };
    });
  }
}
