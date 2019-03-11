import * as React from 'react';
import { isEqual } from 'lodash';
import { removeItemMatch } from 'react-cosmos-shared2/util';
import {
  extractValuesFromObj,
  extendObjWithValues,
  getCompFixtureStates,
  findCompFixtureState,
  createCompFixtureState,
  updateCompFixtureState,
  FixtureDecoratorId,
  ComponentFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { areNodesEqual } from 'react-cosmos-shared2/react';
import { FixtureContext } from '../FixtureContext';
import { getElementAtPath, getExpectedElementAtPath } from './nodeTree';
import { getComponentName } from './getComponentName';
import { getElementRefType } from './getElementRefType';
import { findRelevantElementPaths } from './findRelevantElementPaths';
import { extendPropsWithFixtureState } from './extendPropsWithFixtureState';
import {
  attachChildRefs,
  deleteRefHandler,
  deleteRefHandlers
} from './attachChildRefs';
import { replaceState } from './replaceState';

import {
  FixtureState,
  SetFixtureState
} from 'react-cosmos-shared2/fixtureState';

export type Props = {
  children: React.ReactNode;
  decoratorId: FixtureDecoratorId;
};

// QUESTION: How can class component state capture be a FixtureCapture plugin?
export function FixtureCapture({ children, decoratorId }: Props) {
  return (
    <FixtureContext.Consumer>
      {({ fixtureState, setFixtureState }) => (
        <FixtureCaptureInner
          decoratorId={decoratorId}
          fixtureState={fixtureState}
          setFixtureState={setFixtureState}
        >
          {children}
        </FixtureCaptureInner>
      )}
    </FixtureContext.Consumer>
  );
}

type InnerProps = Props & {
  fixtureState: null | FixtureState;
  setFixtureState: SetFixtureState;
};

// How often to check the state of the loaded component and update the fixture
// state if it changed
const REFRESH_INTERVAL = 200;

class FixtureCaptureInner extends React.Component<InnerProps> {
  elRefs: {
    [elPath: string]: React.Component;
  } = {};

  // Remember initial state of child components to use as a default when
  // resetting fixture state
  initialStates: {
    [elPath: string]: {
      type: React.ComponentClass<any>;
      // "The state [...] should be a plain JavaScript object."
      // https://reactjs.org/docs/react-component.html#state
      state: {};
    };
  } = {};

  timeoutId: null | number = null;

  render(): React.ReactNode {
    const { children, decoratorId, fixtureState } = this.props;

    return attachChildRefs({
      node: extendPropsWithFixtureState(children, fixtureState, decoratorId),
      onRef: this.handleRef,
      decoratorElRef: this,
      decoratorId
    });
  }

  componentDidMount() {
    const { children, decoratorId, fixtureState, setFixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);

    if (elPaths.length === 0) {
      // Create empty fixture state (edge-case: but only if another
      // FixtureCapture instance hasn't created any fixture state)
      setFixtureState(
        (fxState: null | FixtureState) =>
          fxState || {
            components: []
          }
      );
    } else {
      elPaths.forEach(elPath => {
        const compFxState = findCompFixtureState(
          fixtureState,
          decoratorId,
          elPath
        );

        // Component fixture state can be provided before the fixture mounts (eg.
        // a previous snapshot of a fixture state or the current fixture state
        // from another renderer)
        if (!compFxState) {
          this.createFixtureState(elPath);
        }
      });
    }

    // The check should run even if no element paths are found at mount, because
    // the fixture can change during the lifecycle of a FixtureCapture instance
    // and the updated fixture might contain elements of stateful components
    this.scheduleStateCheck();
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Take out the trash
    this.elRefs = {};
    this.initialStates = {};
    deleteRefHandlers(this);
  }

  shouldComponentUpdate(nextProps: InnerProps) {
    const { children, decoratorId, fixtureState } = this.props;

    // Children change when the fixture is updated at runtime (eg. via HMR)
    if (!areNodesEqual(nextProps.children, children)) {
      return true;
    }

    // Quick identity check first
    if (nextProps.fixtureState === fixtureState) {
      return false;
    }

    // No need to update unless children and/or fixture state values changed.
    return !isEqual(
      getCompFixtureStates(nextProps.fixtureState, decoratorId),
      getCompFixtureStates(fixtureState, decoratorId)
    );
  }

  componentDidUpdate(prevProps: InnerProps) {
    const { children, decoratorId, fixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);

    // Remove fixture state for removed child elements (likely via HMR)
    getCompFixtureStates(fixtureState, decoratorId).forEach(({ elPath }) => {
      // FIXME: Also reset fixture state at this element path if the component
      // component type of the corresponding element changed
      if (elPaths.indexOf(elPath) === -1) {
        this.removeFixtureState(elPath);
        this.flushEl(elPath);
      }
    });

    // Update fixture state and component state at remaining child paths
    elPaths.forEach(elPath => {
      const compFxState = findCompFixtureState(
        fixtureState,
        decoratorId,
        elPath
      );
      if (!compFxState) {
        return this.createFixtureState(elPath);
      }

      this.transitionElProps({ elPath, compFxState, prevProps });
      this.transitionElState({ elPath, compFxState, prevProps });
    });
  }

  transitionElProps({
    elPath,
    compFxState,
    prevProps
  }: {
    elPath: string;
    compFxState: ComponentFixtureState;
    prevProps: InnerProps;
  }) {
    const { children } = this.props;
    const childEl = getExpectedElementAtPath(children, elPath);

    // Reset props fixture state when...
    if (
      // a) the props fixture state for this element have been emptied
      // deliberately. Happens when user discards the fixture state to reload
      // the fixture.
      !compFxState.props ||
      // b) mocked props from fixture elemented changed (likely via HMR).
      !areNodesEqual(childEl, getElementAtPath(prevProps.children, elPath))
    ) {
      this.updateFixtureState({ elPath, props: childEl.props });
    }
  }

  transitionElState({
    elPath,
    compFxState: { state: stateFxState },
    prevProps
  }: {
    elPath: string;
    compFxState: ComponentFixtureState;
    prevProps: InnerProps;
  }) {
    const elRef = this.elRefs[elPath];

    // The el ref can be missing for three reasons:
    //   1. Element type is stateless
    //   2. Element type is a class, but doesn't have state. An instance exists
    //      but has been discarded because of its lack of state.
    //   3. Element instance unmounted and is about to remount. When this
    //      happens, the new instance will be handled when its ref fires again.
    if (!elRef) {
      return;
    }

    if (!stateFxState) {
      const { state } = this.initialStates[elPath];

      return replaceState(elRef, state, () => {
        this.updateFixtureState({ elPath, state });
      });
    }

    // The child's state can be out of sync with the fixture state for two
    // reasons:
    //   1. The child's state changed internally
    //   2. The fixture state changed
    // Here we're interested in the second scenario. In the first scenario
    // we want to let the component state override the fixture state.
    const prevCompFxState = findCompFixtureState(
      prevProps.fixtureState,
      this.props.decoratorId,
      elPath
    );
    if (prevCompFxState && !isEqual(prevCompFxState.state, stateFxState)) {
      return replaceState(
        elRef,
        extendObjWithValues(elRef.state, stateFxState)
      );
    }
  }

  handleRef = (elPath: string, elRef: null | React.Component) => {
    if (!elRef) {
      delete this.elRefs[elPath];
      return;
    }

    // Only track instances with state
    const { state } = elRef;
    if (!state) {
      return;
    }

    this.elRefs[elPath] = elRef;
    this.setElInitialState(elPath, elRef);

    const { decoratorId, fixtureState } = this.props;
    const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

    if (!compFxState) {
      return this.createFixtureState(elPath);
    }

    const { state: stateFxState } = compFxState;

    if (!stateFxState) {
      this.updateFixtureState({ elPath, state });
    } else {
      replaceState(elRef, extendObjWithValues(state, stateFxState));
    }
  };

  createFixtureState(elPath: string) {
    const { children, decoratorId, setFixtureState } = this.props;
    const { type, props } = getExpectedElementAtPath(children, elPath);
    const componentName = getComponentName(type);
    const elRef = this.elRefs[elPath];

    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => ({
      ...fixtureState,
      components: createCompFixtureState({
        fixtureState,
        decoratorId,
        elPath,
        componentName,
        props: extractValuesFromObj(props),
        state: elRef && elRef.state ? extractValuesFromObj(elRef.state) : null
      })
    }));
  }

  updateFixtureState({
    elPath,
    props,
    state
  }: {
    elPath: string;
    props?: {};
    state?: {};
  }) {
    const { decoratorId, setFixtureState } = this.props;

    // Make method await-able
    return new Promise(res => {
      // Use state updater callback to ensure concurrent setFixtureState calls
      // don't cancel out each other.
      setFixtureState(
        fixtureState => ({
          ...fixtureState,
          components: updateCompFixtureState({
            fixtureState,
            decoratorId,
            elPath,
            // Returning undefined for props or state will not override the
            // previous values
            props: props && extractValuesFromObj(props),
            state: state && extractValuesFromObj(state)
          })
        }),
        res
      );
    });
  }

  removeFixtureState(elPath: string) {
    const { decoratorId, setFixtureState } = this.props;
    const matcher = elPath
      ? (s: ComponentFixtureState) =>
          s.decoratorId === decoratorId && s.elPath === elPath
      : (s: ComponentFixtureState) => s.decoratorId === decoratorId;

    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => {
      return {
        ...fixtureState,
        components: removeItemMatch(getCompFixtureStates(fixtureState), matcher)
      };
    });
  }

  setElInitialState(elPath: string, elRef: React.Component) {
    const found = this.initialStates[elPath];
    const type = getElementRefType(elRef);

    // Keep the first state recevied for this type
    if (found && found.type === type) {
      return;
    }

    const { state } = elRef;
    if (state) {
      this.initialStates[elPath] = { type, state };
    }
  }

  scheduleStateCheck = () => {
    // Is there a better way to listen to component state changes?
    this.timeoutId = setTimeout(this.checkState, REFRESH_INTERVAL);
  };

  checkState = async () => {
    const { children, decoratorId, fixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);

    await Promise.all(
      Object.keys(this.elRefs).map(async elPath => {
        if (elPaths.indexOf(elPath) === -1) {
          throw new Error(
            `[FixtureCapture] Child ref exists for missing element path "${elPath}"`
          );
        }

        const { state } = this.elRefs[elPath];
        const compFxState = findCompFixtureState(
          fixtureState,
          decoratorId,
          elPath
        );

        if (state && !doesFixtureStateMatchState(state, compFxState)) {
          await this.updateFixtureState({ elPath, state });
        }
      })
    );

    // Schedule next check after all setters have been fulfilled
    this.scheduleStateCheck();
  };

  flushEl(elPath: string) {
    if (this.elRefs[elPath]) {
      delete this.elRefs[elPath];
      delete this.initialStates[elPath];
      deleteRefHandler(this, this.props.decoratorId, elPath);
    }
  }
}

function doesFixtureStateMatchState(
  state: {},
  compFxState: void | ComponentFixtureState
) {
  return (
    compFxState &&
    compFxState.state &&
    isEqual(state, extendObjWithValues(state, compFxState.state))
  );
}
