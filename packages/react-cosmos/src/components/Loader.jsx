import PropTypes from 'prop-types';
import React from 'react';
import merge from 'lodash.merge';
import splitUnserializableParts from 'react-cosmos-utils/lib/unserializable-parts';
import createLinkedList from 'react-cosmos-utils/lib/linked-list';

const getUpdateId = () => Date.now();

const hasInitialFixture = ({ component, fixture }) => Boolean(component && fixture);

const getFixtureState = ({ fixtures, component, fixture, fixtureBody }) => {
  if (!hasInitialFixture({ component, fixture })) {
    // Nothing is rendered until parent frame says so
    return {
      component: null,
      fixture: {
        unserializable: {},
        serializable: {},
      },
      fixtureUpdateId: 0,
    };
  }

  const {
    unserializable,
    serializable,
  } = splitUnserializableParts(fixtures[component][fixture]);

  return {
    component,
    fixture: {
      unserializable,
      serializable: fixtureBody || serializable,
    },
    // Used as React Element key to ensure loaded components are rebuilt on
    // every fixture change (instead of reusing instance and going down the
    // componentWillReceiveProps route)
    fixtureUpdateId: getUpdateId(),
  };
};

class Loader extends React.Component {
  /**
   * Isolated loader for React components.
   *
   * Renders components using fixtures and Proxy middleware. Supports two modes:
   * 1. Controlled programatically by a parent frame (via postMessage protocol).
   * 2. Initialized via props (component & fixture)
   *
   * It both receives fixture changes from parent frame and sends fixture
   * updates bubbled up from proxy chain (due to state changes) to parent frame.
   */
  constructor(props) {
    super(props);

    this.onMessage = this.onMessage.bind(this);
    this.onFixtureUpdate = this.onFixtureUpdate.bind(this);

    // Cache linked list to reuse between lifecycles (proxy list never changes)
    this.firstProxy = createLinkedList(props.proxies);

    this.state = getFixtureState(props);
  }

  componentDidMount() {
    if (!hasInitialFixture(this.props)) {
      window.addEventListener('message', this.onMessage, false);

      // Let parent know loader is ready to render
      parent.postMessage({ type: 'loaderReady' }, '*');
    }
  }

  componentWillUnmount() {
    if (!hasInitialFixture(this.props)) {
      window.removeEventListener('message', this.onMessage);
    }
  }

  onMessage({ data }) {
    if (data.type === 'fixtureLoad') {
      const {
        component,
        fixture,
        // Optional patch to apply on top of initial fixture
        fixtureBody,
      } = data;

      this.setState(getFixtureState({
        fixtures: this.props.fixtures,
        component,
        fixture,
        fixtureBody
      }));
    }
  }

  onFixtureUpdate(fixtureBody) {
    const {
      unserializable,
      serializable
    } = this.state.fixture;

    this.setState({
      fixture: {
        unserializable,
        serializable: {
          ...serializable,
          ...fixtureBody
        }
      }
    });

    parent.postMessage({
      type: 'fixtureUpdate',
      fixtureBody,
    }, '*');
  }

  render() {
    const {
      props,
      state,
      firstProxy,
      onFixtureUpdate,
    } = this;
    const { components } = props;
    const {
      component,
      fixture,
      fixtureUpdateId,
    } = state;

    if (!component) {
      return null;
    }

    return (
      <firstProxy.value
        key={fixtureUpdateId}
        nextProxy={firstProxy.next()}
        component={components[component]}
        fixture={merge(fixture.unserializable, fixture.serializable)}
        onComponentRef={
          () => { /* noope */ }
        }
        onFixtureUpdate={onFixtureUpdate}
      />
    );
  }
}

Loader.propTypes = {
  components: PropTypes.object.isRequired,
  fixtures: PropTypes.object.isRequired,
  proxies: PropTypes.array.isRequired,
  component: PropTypes.string,
  fixture: PropTypes.string,
};

export default Loader;
