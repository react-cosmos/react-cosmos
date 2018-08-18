// @flow

import find from 'lodash/find';
import React, { Component, cloneElement } from 'react';
import { FixtureContext } from './FixtureContext';
import { extractValuesFromObject } from './shared/values';
import {
  getComponentMetadata,
  getComponentId
} from './shared/component-metadata';

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
    const { children, fixtureData, updateFixtureData } = this.props;
    const component = getComponentMetadata(children.type);

    const existingFixtureDataProps = fixtureData.props || [];
    const propsForOtherComponents = existingFixtureDataProps.filter(
      props => props.component.id !== component.id
    );

    // Update fixture data with original component props defined in fixture.
    updateFixtureData({
      props: [
        ...propsForOtherComponents,
        {
          component,
          values: extractValuesFromObject(children.props)
        }
      ]
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.fixtureData.props !== this.props.fixtureData.props;
  }

  render() {
    const { children, fixtureData } = this.props;

    return cloneElement(
      children,
      extendOriginalPropsWithFixtureData(children, fixtureData)
    );
  }
}

function extendOriginalPropsWithFixtureData(element, fixtureData) {
  const { type, props: originalProps } = element;

  if (!fixtureData.props || fixtureData.props.length === 0) {
    return originalProps;
  }

  const componentId = getComponentId(type);
  const relatedProps = find(
    fixtureData.props,
    props => props.component.id === componentId
  );

  if (!relatedProps) {
    // At this point fixtureData has props, but only related to other components
    return originalProps;
  }

  const { values } = relatedProps;
  const mergedProps = {};

  // Use latest prop value for serializable props, and fall back to original
  // value for unserializable props.
  values.forEach(({ serializable, key, value }) => {
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
