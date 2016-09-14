import React from 'react';
import { createStore } from 'redux';

class ReduxProxy extends React.Component {
  constructor(props) {
    super();
    this.store = createStore((state) => state, props.store);
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
        {React.createElement(type, Object.assign({}, props, { ref }))}
      </div>
    );
  }
}

ReduxProxy.propTypes = {
  children: React.PropTypes.element.isRequired,
  store: React.PropTypes.object,
};

ReduxProxy.childContextTypes = {
  store: React.PropTypes.object,
};

export default ReduxProxy;

