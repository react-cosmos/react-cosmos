import React from 'react';
import omit from 'lodash.omit';
import pick from 'lodash.pick';

const notProps = ['children', 'state', 'context', 'reduxState'];

const getFixedFixture = fixture => {
  if (fixture.props) {
    // proxy does not support partially upgraded fixture
    return fixture;
  }

  return {
    ...pick(fixture, notProps),
    props: omit(fixture, notProps)
  };
};

class NormalizePropsProxy extends React.Component {
  render() {
    const { nextProxy, fixture } = this.props;

    return React.createElement(nextProxy.value, {
      ...this.props,
      nextProxy: nextProxy.next(),
      fixture: getFixedFixture(fixture)
    });
  }
}

NormalizePropsProxy.propTypes = {
  nextProxy: React.PropTypes.shape({
    value: React.PropTypes.func,
    next: React.PropTypes.func
  }).isRequired,
  fixture: React.PropTypes.object.isRequired
};

export default () => NormalizePropsProxy;
