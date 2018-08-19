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
import type { FixtureState, SetFixtureState } from './types';

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
        {({ fixtureState, setFixtureState }) => (
          <CapturePropsInner
            fixtureState={fixtureState}
            setFixtureState={setFixtureState}
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
  fixtureState: FixtureState,
  setFixtureState: SetFixtureState
};

class CapturePropsInner extends Component<InnerProps> {
  componentDidMount() {
    const { children, fixtureState, setFixtureState } = this.props;
    const component = getComponentMetadata(children.type);

    const existingFixtureStateProps = fixtureState.props || [];
    const propsForOtherComponents = existingFixtureStateProps.filter(
      props => props.component.id !== component.id
    );

    // Update fixture state with original component props defined in fixture.
    setFixtureState({
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
    return nextProps.fixtureState.props !== this.props.fixtureState.props;
  }

  render() {
    const { children, fixtureState } = this.props;

    return cloneElement(
      children,
      extendOriginalPropsWithFixtureState(children, fixtureState)
    );
  }
}

function extendOriginalPropsWithFixtureState(element, fixtureState) {
  const { type, props: originalProps } = element;

  if (!fixtureState.props || fixtureState.props.length === 0) {
    return originalProps;
  }

  const componentId = getComponentId(type);
  const relatedProps = find(
    fixtureState.props,
    props => props.component.id === componentId
  );

  if (!relatedProps) {
    // At this point fixtureState has props, but only related to other components
    return originalProps;
  }

  const { values } = relatedProps;
  const mergedProps = {};

  // Use latest prop value for serializable props, and fall back to original
  // value for unserializable props.
  values.forEach(({ serializable, key, value }) => {
    mergedProps[key] = serializable ? value : originalProps[key];
  });

  // Clear original props that were removed from fixtureState. This allows users
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
