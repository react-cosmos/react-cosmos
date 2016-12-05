import isEmpty from 'lodash.isempty';
import clone from 'lodash.clone';
import forEach from 'lodash.foreach';

const getComponentTreeState = (component) => {
  const state = component.state ? clone(component.state) : {};
  const childrenStates = {};
  let childState;

  forEach(component.refs, (child, ref) => {
    childState = getComponentTreeState(child);

    if (!isEmpty(childState)) {
      childrenStates[ref] = childState;
    }
  });

  if (!isEmpty(childrenStates)) {
    state.children = childrenStates;
  }

  return state;
};

exports.serialize = (component) => {
  /**
   * Generate a snapshot with the props and state of a component combined,
   * including the state of all nested child components.
   *
   * @param {ReactComponent} component Rendered React component instance
   *
   * @returns {Object} Snapshot with component props and nested state
   */
  const snapshot = clone(component.props);
  const state = getComponentTreeState(component);

  if (!isEmpty(state)) {
    snapshot.state = state;
  }

  return snapshot;
};
