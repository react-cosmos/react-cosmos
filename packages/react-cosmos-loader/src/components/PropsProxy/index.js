import React, { Component } from 'react';
import { func, object } from 'prop-types';

const isComponentClass = componentType =>
  // Warning: Some functions don't have the .prototype property
  componentType.prototype &&
  // ES6 Class
  (componentType.prototype instanceof Component ||
    // React.createClass
    componentType.prototype.getInitialState !== undefined) &&
  true;

export default class PropsProxy extends Component {
  /**
   * The final proxy in the chain that renders the selected component.
   */
  render() {
    const {
      fixture: { component: C, props, children },
      onComponentRef
    } = this.props;

    // Stateless components can't have refs
    return isComponentClass(C) ? (
      <C {...props} ref={onComponentRef}>
        {children}
      </C>
    ) : (
      <C {...props}>{children}</C>
    );
  }
}

PropsProxy.propTypes = {
  fixture: object.isRequired,
  onComponentRef: func.isRequired
};
