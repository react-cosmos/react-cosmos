import React from 'react';
import omit from 'lodash.omit';
import pick from 'lodash.pick';

const getFixedFixture = fixture => {
  if (fixture.props) {
    // the fixture doesn't need fixing if it has props
    return fixture;
  }

  const notProps = ['children', 'state', 'context', 'reduxState'];

  const fixedFixture = Object.assign(pick(fixture, notProps), {
    props: omit(fixture, notProps)
  });
  return fixedFixture;
};

class NormalizePropsProxy extends React.Component {
  render() {
    const { nextProxy, fixture } = this.props;

    const fixedFixture = getFixedFixture(fixture);

    return React.createElement(nextProxy.value, {
      ...this.props,
      nextProxy: nextProxy.next(),
      fixture: fixedFixture
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
