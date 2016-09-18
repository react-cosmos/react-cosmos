import React from 'react';
import { createStore } from 'redux';
import _ from 'lodash';

const ReduxProxyFactory = ({
  reducer,
  storeKey,
} = {
  reducer: (state, { payload }) => Object.assign({}, state, payload),
  storeKey: 'reduxState',
}) => {
  class ReduxProxy extends React.Component {
    constructor(fixture) {
      super();
      this.store = createStore(reducer, fixture[storeKey]);
    }

    getChildContext() {
      return {
        store: this.store,
      };
    }

    render() {
      // This creates a new element identical to this.props.children.
      // It is needed because in older versions of React context is owner-based
      // https://gist.github.com/jimfb/0eb6e61f300a8c1b2ce7
      // React.cloneElement is not enough either, as it doesn't reset owner in older React versions.
      const { type, props, ref } = this.props.children;

      return (
        <div>
          {React.createElement(type, _.assign({}, _.omit(props, storeKey), { ref }))}
        </div>
      );
    }
  }

  ReduxProxy.defaultProps = {
    [storeKey]: {},
  };

  ReduxProxy.propTypes = {
    children: React.PropTypes.element.isRequired,
    [storeKey]: React.PropTypes.object,
  };

  ReduxProxy.childContextTypes = {
    store: React.PropTypes.object,
  };

  return ReduxProxy;
};

module.exports = ReduxProxyFactory;
