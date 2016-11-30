import React from 'react';
import splitUnserializableParts from 'react-cosmos-utils/lib/unserializable-parts';
import createLinkedList from 'react-cosmos-utils/lib/linked-list';

const getUpdateId = () => Date.now();

class Loader extends React.Component {
  /**
   * Isolated loader for React components.
   *
   * Renders components using fixtures and Proxy middleware, controlled
   * programatically by a parent frame (via postMessage protocol).
   *
   * It both receives fixture changes from parent frame and sends fixture
   * updates bubbled up from proxy chain (due to state changes) to parent frame.
   */
  constructor(props) {
    super(props);

    this.onMessage = this.onMessage.bind(this);

    // Cache linked list to reuse between lifecycles (proxy list never changes)
    this.firstProxy = createLinkedList(props.proxies);

    this.state = {
      // Nothing is rendered until parent frame says so
      component: null,
      fixture: {
        unserializable: {},
        serializable: {},
      },
      fixtureUpdateId: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);

    // Let parent know loader is ready to render
    parent.postMessage({ type: 'frameReady' }, '*');
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  onMessage({ data }) {
    if (data.type === 'fixtureLoad') {
      const {
        component,
        fixture,
        // Optional patch to apply on top of initial fixture
        fixtureBody,
      } = data;

      const {
        unserializable,
        serializable,
      } = splitUnserializableParts(this.props.fixtures[component][fixture]);

      this.updateFixtureState({
        component,
        fixture: {
          unserializable,
          serializable: fixtureBody || serializable,
        },
      });
    }

    if (data.type === 'fixtureChange') {
      const {
        unserializable,
      } = this.state.fixture;

      this.updateFixtureState({
        fixture: {
          unserializable,
          serializable: data.fixtureBody,
        },
      });
    }
  }

  onFixtureUpdate(fixtureBody) {
    parent.postMessage({
      type: 'fixtureUpdate',
      fixtureBody,
    }, '*');
  }

  updateFixtureState(state) {
    this.setState({
      ...state,
      // Used as React Element key to ensure loaded components are rebuilt on
      // every fixture change (instead of reusing instance and going down the
      // componentWillReceiveProps route)
      fixtureUpdateId: getUpdateId(),
    });
  }

  render() {
    const { props, firstProxy } = this;
    const { components } = props;
    const {
      component,
      fixture,
      fixtureUpdateId,
    } = this.state;

    if (!component) {
      return null;
    }

    return (
      <firstProxy.value
        key={fixtureUpdateId}
        nextProxy={firstProxy.next()}
        component={components[component]}
        fixture={{
          ...fixture.unserializable,
          ...fixture.serializable,
        }}
        onPreviewRef={() => { /* noope */ }}
        onFixtureUpdate={this.onFixtureUpdate}
      />
    );
  }
}

Loader.propTypes = {
  components: React.PropTypes.object.isRequired,
  fixtures: React.PropTypes.object.isRequired,
  proxies: React.PropTypes.array.isRequired,
};

export default Loader;
