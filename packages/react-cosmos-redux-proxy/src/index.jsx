import React from 'react';
import { createStore } from 'redux';
import _ from 'lodash';

export default ({ storeKey } = { storeKey: 'reduxStore' }) => {
  class ReduxProxy extends React.Component {
    constructor(fixture) {
      super();
      this.store = createStore((state) => state, fixture[storeKey]);
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
          {React.createElement(type, Object.assign({}, _.omit(props, storeKey), { ref }))}
        </div>
      );
    }
  }

  ReduxProxy.propTypes = {
    children: React.PropTypes.element.isRequired,
  };

  ReduxProxy.childContextTypes = {
    store: React.PropTypes.object,
  };

  return ReduxProxy;
};

