import React from 'react';
import omit from 'lodash.omit';

const defaults = {
  fixtureKey: 'context',
};

export default function createContextProxy(options) {
  const {
    fixtureKey,
    childContextTypes,
  } = { ...defaults, ...options };

  class ContextProxy extends React.Component {
    getChildContext() {
      return this.props.fixture[fixtureKey];
    }

    render() {
      const {
        nextProxy,
        fixture,
        onComponentRef,
      } = this.props;

      return React.createElement(nextProxy.value, { ...this.props,
        nextProxy: nextProxy.next(),
        // TODO: No longer omit when props will be read from fixture.props
        // https://github.com/react-cosmos/react-cosmos/issues/217
        fixture: omit(fixture, fixtureKey),
        onComponentRef,
      });
    }
  }

  ContextProxy.propTypes = {
    nextProxy: React.PropTypes.shape({
      value: React.PropTypes.func,
      next: React.PropTypes.func,
    }).isRequired,
    component: React.PropTypes.func.isRequired,
    fixture: React.PropTypes.object.isRequired,
    onComponentRef: React.PropTypes.func.isRequired,
    onFixtureUpdate: React.PropTypes.func.isRequired,
  };

  ContextProxy.childContextTypes = childContextTypes;

  return ContextProxy;
}
