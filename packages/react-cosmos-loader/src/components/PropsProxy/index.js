import React, { Component } from 'react';
import { func, object } from 'prop-types';
import { isComponentClass } from '../../utils/is-component-class';

export default class PropsProxy extends Component {
  /**
   * The final proxy in the chain that renders the selected component.
   */
  render() {
    const {
      fixture: { component: C, props, children: fixtureChildren },
      onComponentRef
    } = this.props;

    // Legacy versions of react-cosmos supported specifying children
    // directly on the fixture, rather than in fixture.props
    const finalProps = { children: fixtureChildren, ...props };

    // Stateless components can't have refs
    return isComponentClass(C) ? (
      <C {...finalProps} ref={onComponentRef} />
    ) : (
      <C {...finalProps} />
    );
  }
}

PropsProxy.propTypes = {
  fixture: object.isRequired,
  onComponentRef: func.isRequired
};
