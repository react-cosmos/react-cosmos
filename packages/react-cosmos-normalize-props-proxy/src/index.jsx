import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash.omit';
import pick from 'lodash.pick';

const defaults = {
  notProps: ['children', 'state', 'context', 'reduxState'],
};

const getFixedFixture = (fixture, notProps) => {
  if (fixture.props) {
    // Proxy does not support partially upgraded fixture
    return fixture;
  }

  return {
    ...pick(fixture, notProps),
    props: omit(fixture, notProps)
  };
};

export default function createNormalizePropsProxy(options) {
  const {
    notProps
  } = { ...defaults, ...options };

  class NormalizePropsProxy extends React.Component {
    render() {
      const { nextProxy, fixture } = this.props;

      return React.createElement(nextProxy.value, {
        ...this.props,
        nextProxy: nextProxy.next(),
        fixture: getFixedFixture(fixture, notProps)
      });
    }
  }

  NormalizePropsProxy.propTypes = {
    nextProxy: PropTypes.shape({
      value: PropTypes.func,
      next: PropTypes.func
    }).isRequired,
    fixture: PropTypes.object.isRequired
  };

  return NormalizePropsProxy;
}
