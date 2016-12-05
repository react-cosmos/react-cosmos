import React from 'react';
import omit from 'lodash.omit';
import isEmpty from 'lodash.isempty';
import forEach from 'lodash.foreach';

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
  const props = omit(options.snapshot, 'state', 'children');
  const state = options.snapshot.state;
  const children = options.snapshot.children;

  const element = React.createElement(options.component, props, children);
  // TODO: Use callback ref: https://facebook.github.io/react/docs/top-level-api.html#reactdom.render
  // eslint-disable-next-line react/no-render-return-value
  const component = ReactDOM.render(element, options.container);

  if (!isEmpty(state)) {
    exports.injectState(component, state);
  }

  return component;
};

exports.injectState = (component, state) => {
  const rootState = omit(state, 'children');
  const childrenStates = state.children;

  component.setState(rootState, () => {
    if (isEmpty(childrenStates)) {
      return;
    }

    forEach(component.refs, (child, ref) => {
      if (!isEmpty(childrenStates[ref])) {
        exports.injectState(child, childrenStates[ref]);
      }
    });
  });
};
