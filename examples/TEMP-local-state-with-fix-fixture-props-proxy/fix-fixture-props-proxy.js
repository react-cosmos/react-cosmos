import React from 'react';
import reduce from 'lodash.reduce';

const getFixedFixture = fixture => {
  if (fixture.props) {
    // the fixture doesn't need fixing if it has props
    return fixture;
  }
  // TODO: bring notProps from cosmos config
  const notProps = ['children', 'state'];
  const fixedFixture = reduce(fixture, (final, value, key) => {
    if (notProps.indexOf(key) === -1) {
      final.props[key] = value;
    } else {
      final[key] = value;
    }
    return final;
  }, {
    props: {}
  });
  return fixedFixture;
};

class FixFixturePropsProxy extends React.Component {
  render() {
    const {
      nextProxy,
      fixture,
    } = this.props;

    const fixedFixture = getFixedFixture(fixture);

    return React.createElement(nextProxy.value, {
      ...this.props,
      nextProxy: nextProxy.next(),
      fixture: fixedFixture
    });
  }
}

FixFixturePropsProxy.propTypes = {
  nextProxy: React.PropTypes.shape({
    value: React.PropTypes.func,
    next: React.PropTypes.func,
  }).isRequired,
  fixture: React.PropTypes.object.isRequired,
};

export default () => FixFixturePropsProxy;
