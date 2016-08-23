var _ = require('lodash');

exports.serialize = function(component) {
  /**
   * Generate a snapshot with the props and state of a component combined,
   * including the state of all nested child components.
   *
   * @param {ReactComponent} component Rendered React component instance
   *
   * @returns {Object} Snapshot with component props and nested state
   */
  var snapshot = _.clone(component.props),
      state = getComponentTreeState(component);

  if (!_.isEmpty(state)) {
    snapshot.state = state;
  }

  return snapshot;
};

var getComponentTreeState = function(component) {
  var state = component.state ? _.clone(component.state) : {},
      childrenStates = {},
      childState;

  _.each(component.refs, function(child, ref) {
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
