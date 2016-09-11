import _ from 'lodash';
import React from 'react';

const ReactDOM = require('react-dom-polyfill')(React);

exports.render = (options) => {
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
  const props = _.omit(options.snapshot, 'state', 'children');
  const state = options.snapshot.state;
  const children = options.snapshot.children;

  const element = React.createElement(options.component, props, children);
  // TODO: Use callback ref: https://facebook.github.io/react/docs/top-level-api.html#reactdom.render
  // eslint-disable-next-line react/no-render-return-value
  const component = ReactDOM.render(element, options.container);

  if (!_.isEmpty(state)) {
    exports.injectState(component, state);
  }

  return component;
};

exports.injectState = (component, state) => {
  const rootState = _.omit(state, 'children');
  const childrenStates = state.children;

  component.setState(rootState, () => {
    if (_.isEmpty(childrenStates)) {
      return;
    }

    _.each(component.refs, (child, ref) => {
      if (!_.isEmpty(childrenStates[ref])) {
        exports.injectState(child, childrenStates[ref]);
      }
    });
  });
};
