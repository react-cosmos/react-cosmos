import * as React from 'react';
import { isEqual } from 'lodash';
import {
  FixtureDecoratorId,
  FixtureState,
  FixtureStateClassState,
  createValues,
  extendWithValues,
  getFixtureStateProps,
  findFixtureStateProps,
  createFixtureStateProps,
  updateFixtureStateProps,
  removeFixtureStateProps,
  getFixtureStateClassState,
  findFixtureStateClassState,
  createFixtureStateClassState,
  updateFixtureStateClassState,
  removeFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { areNodesEqual } from 'react-cosmos-shared2/react';
import { SetFixtureState } from '../shared';
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
  fixtureState: FixtureState;
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
      // Create empty fixture state (edge-case: whilst making sure not to
      // override any pending fixture state update
      setFixtureState((prevFixtureState: FixtureState) => ({
        ...prevFixtureState,
        props: prevFixtureState.props || []
      }));
    } else {
      elPaths.forEach(elPath => {
        // Component fixture state can be provided before the fixture mounts (eg.
        // a previous snapshot of a fixture state or the current fixture state
        // from another renderer)
        if (!findFixtureStateProps(fixtureState, { decoratorId, elPath })) {
          this.createFixtureStateProps(elPath);
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
    const propsChanged = !isEqual(
      getFixtureStateProps(nextProps.fixtureState, decoratorId),
      getFixtureStateProps(fixtureState, decoratorId)
    );
    const classStateChanged = !isEqual(
      getFixtureStateClassState(nextProps.fixtureState, decoratorId),
      getFixtureStateClassState(fixtureState, decoratorId)
    );
    return propsChanged || classStateChanged;
  }

  componentDidUpdate(prevProps: InnerProps) {
    const { children, decoratorId, fixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);

    // Remove fixture state for removed child elements (likely via HMR)
    // FIXME: Also reset fixture state at this element path if the component
    // component type of the corresponding element changed
    getFixtureStateProps(fixtureState, decoratorId).forEach(({ elementId }) => {
      const { elPath } = elementId;
      if (elPaths.indexOf(elPath) === -1) {
        this.removeFixtureStateProps(elPath);
      }
    });
    getFixtureStateClassState(fixtureState, decoratorId).forEach(
      ({ elementId }) => {
        const { elPath } = elementId;
        if (elPaths.indexOf(elPath) === -1) {
          this.removeFixtureStateClassState(elPath);
          this.flushEl(elPath);
        }
      }
    );

    // Update fixture state and component state at remaining child paths
    elPaths.forEach(elPath => {
      const elementId = { decoratorId, elPath };

      if (findFixtureStateProps(fixtureState, elementId)) {
        this.transitionProps(elPath, prevProps);
      } else {
        return this.createFixtureStateProps(elPath);
      }

      const fsClassState = findFixtureStateClassState(fixtureState, elementId);
      if (fsClassState) {
        this.transitionState(elPath, fsClassState, prevProps);
      } else {
        if (this.initialStates[elPath]) {
          const { state } = this.initialStates[elPath];
          const elRef = this.elRefs[elPath];
          if (!isEqual(elRef.state, state)) {
            replaceState(elRef, state);
          }
          this.createFixtureStateClassState(elPath, state);
        }
      }
    });
  }

  transitionProps(elPath: string, prevProps: InnerProps) {
    const childEl = getExpectedElementAtPath(this.props.children, elPath);
    if (!areNodesEqual(childEl, getElementAtPath(prevProps.children, elPath))) {
      this.updateFixtureStateProps(elPath, childEl.props);
    }
  }

  transitionState(
    elPath: string,
    fsClassState: FixtureStateClassState,
    prevProps: InnerProps
  ) {
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

    // if (!fsState) {
    //   const { state } = this.initialStates[elPath];

    //   return replaceState(elRef, state, () => {
    //     this.updateFixtureState({ elPath, state });
    //   });
    // }

    // The child's state can be out of sync with the fixture state for two
    // reasons:
    //   1. The child's state changed internally
    //   2. The fixture state changed
    // Here we're interested in the second scenario. In the first scenario
    // we want to let the component state override the fixture state.
    const prevFsClassState = findFixtureStateClassState(
      prevProps.fixtureState,
      { decoratorId: this.props.decoratorId, elPath }
    );
    if (prevFsClassState && !isEqual(prevFsClassState.values, fsClassState)) {
      return replaceState(
        elRef,
        extendWithValues(elRef.state, fsClassState.values)
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
    const fixtureId = { decoratorId, elPath };
    const fsClassState = findFixtureStateClassState(fixtureState, fixtureId);
    if (!fsClassState) {
      return this.createFixtureStateClassState(elPath, state);
    }

    replaceState(elRef, extendWithValues(state, fsClassState.values));
  };

  createFixtureStateProps(elPath: string) {
    const { children, decoratorId, setFixtureState } = this.props;
    const { type, props } = getExpectedElementAtPath(children, elPath);
    const elementId = { decoratorId, elPath };
    const componentName = getComponentName(type);
    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => ({
      ...fixtureState,
      props: createFixtureStateProps({
        fixtureState,
        elementId,
        values: createValues(props),
        componentName
      })
    }));
  }

  createFixtureStateClassState(elPath: string, state: {}) {
    const { decoratorId, setFixtureState } = this.props;
    const elementId = { decoratorId, elPath };
    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => ({
      ...fixtureState,
      classState: createFixtureStateClassState({
        fixtureState,
        elementId,
        values: createValues(state)
      })
    }));
  }

  updateFixtureStateProps(elPath: string, props: {}) {
    const { decoratorId, setFixtureState } = this.props;
    const elementId = { decoratorId, elPath };
    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => ({
      ...fixtureState,
      props: updateFixtureStateProps({
        fixtureState,
        elementId,
        values: createValues(props)
      })
    }));
  }

  updateFixtureStateClassState(elPath: string, state: {}, cb?: () => unknown) {
    const { decoratorId, setFixtureState } = this.props;
    const elementId = { decoratorId, elPath };
    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(
      fixtureState => ({
        ...fixtureState,
        classState: updateFixtureStateClassState({
          fixtureState,
          elementId,
          values: createValues(state)
        })
      }),
      cb
    );
  }

  removeFixtureStateProps(elPath: string) {
    const { decoratorId, setFixtureState } = this.props;
    const elementId = { decoratorId, elPath };
    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => {
      return {
        ...fixtureState,
        props: removeFixtureStateProps(fixtureState, elementId)
      };
    });
  }

  removeFixtureStateClassState(elPath: string) {
    const { decoratorId, setFixtureState } = this.props;
    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => {
      return {
        ...fixtureState,
        classState: removeFixtureStateClassState(fixtureState, {
          decoratorId,
          elPath
        })
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
        const elementId = { decoratorId, elPath };
        const fsClassState = findFixtureStateClassState(
          fixtureState,
          elementId
        );

        if (
          fsClassState &&
          state &&
          !doesFixtureStateMatchClassState(fsClassState, state)
        ) {
          await new Promise(resolve => {
            this.updateFixtureStateClassState(elPath, state, resolve);
          });
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

function doesFixtureStateMatchClassState(
  fsClassState: FixtureStateClassState,
  state: {}
) {
  return isEqual(state, extendWithValues(state, fsClassState.values));
}
