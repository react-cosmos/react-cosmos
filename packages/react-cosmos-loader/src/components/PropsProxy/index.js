import React, { Component } from 'react';
import { func, object } from 'prop-types';
import { isComponentClass } from '../../utils/is-component-class';

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
