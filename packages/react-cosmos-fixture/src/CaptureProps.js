// @flow

import { isEqual, find } from 'lodash';
import React, { Component } from 'react';
import { replaceOrAddItem, removeItemMatch } from 'react-cosmos-shared2/util';
import {
  extractValuesFromObject,
  getPropsFixtureState
} from 'react-cosmos-shared2/fixtureState';
import {
  getDecoratorId,
  createFxStateMatcher,
  createElFxStateMatcher
} from './shared/decorator';
import { getComponentName } from './shared/getComponentName';
import {
  findElementPaths,
  getElementAtPath,
  getExpectedElementAtPath,
  setElementAtPath,
  areChildrenEqual
} from './shared/childrenTree';
import { FixtureContext } from './FixtureContext';

import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { Children } from './shared/childrenTree';
import type { CapturePropsProps } from './index.js.flow';

const DEFAULT_RENDER_KEY = 0;

export function CaptureProps({ children }: CapturePropsProps) {
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

CaptureProps.cosmosCaptureProps = false;

type InnerProps = CapturePropsProps & {
  fixtureState: ?FixtureState,
  setFixtureState: SetState<FixtureState>
};

class CapturePropsInner extends Component<InnerProps> {
  render() {
    const { children, fixtureState } = this.props;
    const decoratorId = getDecoratorId(this);

    return extendChildrenWithFixtureState(children, fixtureState, decoratorId);
  }

  componentDidMount() {
    findRelevantElementPaths(this.props.children).forEach(elPath =>
      this.replaceOrAddFixtureState(elPath)
    );
  }

  componentWillUnmount() {
    const { fixtureState } = this.props;

    // Remove fixture state corresponding to this decorator instance
    if (fixtureState && fixtureState.props) {
      this.removeFixtureState();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { children, fixtureState } = this.props;

    // Children change when the fixture is updated at runtime (eg. via HMR)
    if (!areChildrenEqual(nextProps.children, children)) {
      return true;
    }

    // Quick identity check first
    if (nextProps.fixtureState === fixtureState) {
      return false;
    }

    const decoratorId = getDecoratorId(this);
    const matcher = createFxStateMatcher(decoratorId);

    // No need to update unless children and/or fixture state values changed.
    return !isEqual(
      getPropsFixtureState(nextProps.fixtureState, matcher),
      getPropsFixtureState(fixtureState, matcher)
    );
  }

  componentDidUpdate(prevProps) {
    const { children, fixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);

    const decoratorId = getDecoratorId(this);
    const propsFxStates = getPropsFixtureState(
      fixtureState,
      createFxStateMatcher(decoratorId)
    );

    // Remove fixture state for removed child elements (likely via HMR).
    propsFxStates.forEach(({ elPath }) => {
      if (elPaths.indexOf(elPath) === -1) {
        this.removeFixtureState(elPath);
      }
    });

    // Update fixture state for existing child paths
    elPaths.map(elPath => {
      const propsFxState = find(propsFxStates, i => i.elPath === elPath);

      // Reset fixture state when...
      if (
        // a) the fixture state for this element has been emptied deliberately.
        // Happens when user discards the fixture state to reload the fixture.
        !propsFxState ||
        // b) mocked props from fixture elemented changed (likely via HMR).
        !isEqual(
          getElementAtPath(children, elPath),
          getElementAtPath(prevProps.children, elPath)
        )
      ) {
        this.replaceOrAddFixtureState(elPath);
      }
    });
  }

  replaceOrAddFixtureState(elPath) {
    const { children, setFixtureState } = this.props;
    const decoratorId = getDecoratorId(this);
    const { type, props } = getExpectedElementAtPath(children, elPath);
    const componentName = getComponentName(type);

    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => {
      const propsFxState = {
        decoratorId,
        elPath: elPath,
        componentName,
        renderKey: DEFAULT_RENDER_KEY,
        values: extractValuesFromObject(props)
      };

      return {
        props: replaceOrAddItem(
          getPropsFixtureState(fixtureState),
          createElFxStateMatcher(decoratorId, elPath),
          propsFxState
        )
      };
    });
  }

  removeFixtureState(elPath?: string) {
    const { setFixtureState } = this.props;
    const decoratorId = getDecoratorId(this);
    const matcher = elPath
      ? createElFxStateMatcher(decoratorId, elPath)
      : createFxStateMatcher(decoratorId);

    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => {
      return {
        props: removeItemMatch(getPropsFixtureState(fixtureState), matcher)
      };
    });
  }
}

function extendChildrenWithFixtureState(children, fixtureState, decoratorId) {
  const elPaths = findRelevantElementPaths(children);

  return elPaths.reduce((extendedChildren, elPath): Children => {
    const [propsFxState] = getPropsFixtureState(
      fixtureState,
      createElFxStateMatcher(decoratorId, elPath)
    );

    return setElementAtPath(extendedChildren, elPath, element => {
      if (!propsFxState) {
        return {
          ...element,
          key: getElRenderKey(elPath, DEFAULT_RENDER_KEY)
        };
      }

      // HACK alert: Editing React Element by hand
      // This is blasphemy, but there are two reasons why React.cloneElement
      // isn't ideal:
      //   1. Props need to overridden (not merged)
      //   2. element.key has to be set to control whether the prev instance
      //      should be reused on not
      // Still, in case this method causes trouble in the future, both reasons
      // can be overcome in the following ways:
      //   1. Set original props that aren't present in fixture state to
      //      undefined
      //   2. Create a wrapper component or element and to set the key on
      // Useful links:
      //   - https://reactjs.org/docs/react-api.html#cloneelement
      //   - https://github.com/facebook/react/blob/15a8f031838a553e41c0b66eb1bcf1da8448104d/packages/react/src/ReactElement.js#L293-L362
      const { props } = element;
      const { renderKey } = propsFxState;

      return {
        ...element,
        props: extendPropsWithFixtureState(props, propsFxState),
        key: getElRenderKey(elPath, renderKey)
      };
    });
  }, children);
}

function findRelevantElementPaths(children) {
  const elPaths = findElementPaths(children);

  return elPaths.filter(elPath => {
    const { type } = getExpectedElementAtPath(children, elPath);

    return type.cosmosCaptureProps !== false;
  });
}

function extendPropsWithFixtureState(mockedProps, propsFxState) {
  const { values } = propsFxState;
  const mergedProps = {};

  // Use fixture state for serializable props, and fall back to mocked values
  // for unserializable props.
  values.forEach(({ serializable, key, stringified }) => {
    mergedProps[key] = serializable
      ? JSON.parse(stringified)
      : mockedProps[key];
  });

  return mergedProps;
}

function getElRenderKey(elPath, renderKey) {
  return `${elPath}-${renderKey}`;
}
