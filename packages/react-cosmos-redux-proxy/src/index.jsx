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

