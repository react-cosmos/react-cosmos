var _ = require('lodash'),
    React = require('react'),
    ReactDOM = require('react-dom-polyfill')(React);

exports.render = function(options) {
  /**
   * Render a component and reproduce a state snapshot by recursively injecting
   * the nested state into the component tree it generates.
   *
   * @param {Object} options
   * @param {ReactClass} options.component
   * @param {Object} options.snapshot
   * @param {DOMElement} options.container
   *
   * @returns {ReactComponent} Reference to the rendered component
   */
  var props = _.omit(options.snapshot, 'state', 'children'),
      state = options.snapshot.state,
      children = options.snapshot.children;

  var element = React.createElement(options.component, props, children),
      component = ReactDOM.render(element, options.container);

  if (!_.isEmpty(state)) {
    exports.injectState(component, state);
  }

  return component;
};

exports.injectState = function(component, state) {
  var rootState = _.omit(state, 'children'),
      childrenStates = state.children;

  component.setState(rootState, function() {
    if (_.isEmpty(childrenStates)) {
      return;
    }

    _.each(component.refs, function(child, ref) {
      if (!_.isEmpty(childrenStates[ref])) {
        exports.injectState(child, childrenStates[ref]);
      }
    });
  });
};
