// @flow

import React, { Component } from 'react';
import { FixtureContext } from './FixtureContext';
import { replaceOrAddItem } from './shared/utility';
import { extractValuesFromObject } from './shared/values';
import { getInstanceId, getComponentName } from './shared/decorator';
import { getProps, getPropsInstance } from './shared/fixtureState';

import type { Element } from 'react';
import type { FixtureState, SetFixtureState } from './types/fixtureState';

type Props = {
  children: Element<any>
};

const DEFAULT_RENDER_KEY = 0;

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
  fixtureState: ?FixtureState,
  setFixtureState: SetFixtureState
};

class CapturePropsInner extends Component<InnerProps> {
  componentDidMount() {
    const { children, setFixtureState } = this.props;
    const instanceId = getInstanceId(this);
    const componentName = getComponentName(children.type);

    // Add original component props (defined in fixture) to fixture state.
    // Because fixtureState changes are async and multiple CapturePropsInner
    // instances can mount before a state change propagates, merging prop
    // values over props.fixtureState can cancel out other identical operations
    // from different CapturePropsInner instances. To ensure each state
    // transformation is honored we use a state updater callback.
    setFixtureState(fixtureState => {
      const instanceProps = {
        instanceId,
        componentName,
        renderKey: DEFAULT_RENDER_KEY,
        values: extractValuesFromObject(children.props)
      };

      return {
        props: replaceOrAddItem(
          getProps(fixtureState),
          props => props.instanceId === instanceId,
          instanceProps
        )
      };
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.fixtureState === this.props.fixtureState) {
      return false;
    }

    const instanceId = getInstanceId(this);

    // TODO: Avoid renders when fixture state values for this instance are
    // the same. Do this after implementing logic for unserializable values.
    return (
      getPropsInstance(nextProps.fixtureState, instanceId) !==
      getPropsInstance(this.props.fixtureState, instanceId)
    );
  }

  render() {
    const { children, fixtureState } = this.props;
    const instanceId = getInstanceId(this);
    const propsInstance = getPropsInstance(fixtureState, instanceId);

    // HACK alert: Editing React Element by hand
    // This is blasphemy, but there are two reasons why React.cloneElement
    // isn't ideal:
    //   1. Props need to overridden (not merged)
    //   2. element.key has to be set to control whether the previous instance
    //      should be reused on not
    // Also note that any previous key is irrelevant, as CaptureProps only
    // accepts a *single* React.Element as children.
    // Still, in case this method causes trouble in the future, both reasons
    // can be overcome in the following ways:
    //   1. Set original props that aren't present in fixture state to undefined
    //   2. Create a wrapper component or element and to set the key on
    // Useful links:
    //   - https://reactjs.org/docs/react-api.html#cloneelement
    //   - https://github.com/facebook/react/blob/15a8f031838a553e41c0b66eb1bcf1da8448104d/packages/react/src/ReactElement.js#L293-L362
    return {
      ...children,
      props: extendOriginalPropsWithFixtureState(children.props, propsInstance),
      key: propsInstance ? propsInstance.renderKey : DEFAULT_RENDER_KEY
    };
  }
}

function extendOriginalPropsWithFixtureState(originalProps, propsInstance) {
  if (!propsInstance) {
    return originalProps;
  }

  const { values } = propsInstance;
  const mergedProps = {};

  // Use latest prop value for serializable props, and fall back to original
  // value for unserializable props.
  values.forEach(({ serializable, key, value }) => {
    mergedProps[key] = serializable ? value : originalProps[key];
  });

  return mergedProps;
}
