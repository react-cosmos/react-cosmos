// @flow

import React, { Component } from 'react';
import { FixtureContext } from './FixtureContext';
import { OnMount } from './OnMount';
import { extractPropsFromObject } from './shared';

import type { Element } from 'react';

type Props = {
  children: Element<any>
};

export class CaptureProps extends Component<Props> {
  static cosmosCaptureProps = false;

  render() {
    const { children } = this.props;
    const { type, props } = children;

    if (type.cosmosCaptureProps === false) {
      return children;
    }

    // TODO: Use fixtureData.props
    return (
      <FixtureContext.Consumer>
        {({ updateFixtureData }) => (
          <OnMount
            cb={() => updateFixtureData('props', extractPropsFromObject(props))}
          >
            {children}
          </OnMount>
        )}
      </FixtureContext.Consumer>
    );
  }
}
