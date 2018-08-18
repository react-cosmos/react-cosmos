// @flow

import React, { Component, cloneElement } from 'react';
import { FixtureContext } from './FixtureContext';
import { extractPropsFromObject } from './shared';

import type { Element } from 'react';
import type { FixtureData, UpdateFixtureData } from './types';

type Props = {
  children: Element<any>
};

export class CaptureProps extends Component<Props> {
  static cosmosCaptureProps = false;

  render() {
    const { children } = this.props;
    const { type } = children;

    if (type.cosmosCaptureProps === false) {
      return children;
    }

    return (
      <FixtureContext.Consumer>
        {({ fixtureData, updateFixtureData }) => (
          <CapturePropsInner
            fixtureData={fixtureData}
            updateFixtureData={updateFixtureData}
          >
            {children}
          </CapturePropsInner>
        )}
      </FixtureContext.Consumer>
    );
  }
}

type InnerProps = {
  children: Element<any>,
  fixtureData: FixtureData,
  updateFixtureData: UpdateFixtureData
};

class CapturePropsInner extends Component<InnerProps> {
  componentDidMount() {
    const { children, updateFixtureData } = this.props;

    // Update fixture data with original component props defined in fixture.
    updateFixtureData('props', extractPropsFromObject(children.props));
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.fixtureData.props !== this.props.fixtureData.props;
  }

  render() {
    const { children, fixtureData } = this.props;

    return cloneElement(
      children,
      extendOriginalPropsWithFixtureData(children.props, fixtureData)
    );
  }
}

function extendOriginalPropsWithFixtureData(originalProps, fixtureData) {
  if (!fixtureData.props) {
    return originalProps;
  }

  const mergedProps = {};

  // Use latest prop value for serializable props, and fall back to original
  // value for unserializable props.
  fixtureData.props.forEach(({ serializable, key, value }) => {
    mergedProps[key] = serializable ? value : originalProps[key];
  });

  // Clear original props that were removed from fixtureData. This allows users
  // to remove original props. We need to to this because React.cloneElement
  // merges new props with original ones
  // https://reactjs.org/docs/react-api.html#cloneelement
  Object.keys(originalProps).forEach(key => {
    if (Object.keys(mergedProps).indexOf(key) === -1) {
      mergedProps[key] = undefined;
    }
  });

  return mergedProps;
}
