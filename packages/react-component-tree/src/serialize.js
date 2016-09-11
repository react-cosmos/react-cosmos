import _ from 'lodash';

const getComponentTreeState = (component) => {
  const state = component.state ? _.clone(component.state) : {};
  const childrenStates = {};
  let childState;

  _.each(component.refs, (child, ref) => {
    childState = getComponentTreeState(child);

    if (!_.isEmpty(childState)) {
      childrenStates[ref] = childState;
    }
  });

  if (!_.isEmpty(childrenStates)) {
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
  const snapshot = _.clone(component.props);
  const state = getComponentTreeState(component);

  if (!_.isEmpty(state)) {
    snapshot.state = state;
  }

  return snapshot;
};
