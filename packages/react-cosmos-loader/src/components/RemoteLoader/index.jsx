import React, { Component } from 'react';
import { object, array } from 'prop-types';
import merge from 'lodash.merge';
import splitUnserializableParts
  from 'react-cosmos-utils/lib/unserializable-parts';
import createLinkedList from 'react-cosmos-utils/lib/linked-list';
import PropsProxy from '../PropsProxy';

const noope = () => {};

const noFixtureState = {
  component: null,
  fixture: null,
  fixtureBody: null,
  fixtureId: 0,
};

const getUpdateId = () => Date.now();

const extractFixtureNames = fixtures =>
  Object.keys(fixtures).reduce((acc, next) => {
    acc[next] = Object.keys(fixtures[next]);
    return acc;
  }, {});

const getFixtureState = ({
  fixtures,
  component,
  fixture,
  fixtureBody,
  fixtureId,
}) => {
  if (!fixture) {
    return noFixtureState;
  }

  const { unserializable, serializable } = splitUnserializableParts(
    fixtures[component][fixture]
  );

  return {
    component,
    fixture,
    fixtureBody: {
      unserializable,
      serializable: fixtureBody === undefined ? serializable : fixtureBody,
    },
    // Used as React Element key to ensure loaded components are rebuilt on
    // every fixture change (instead of reusing instance and going down the
    // componentWillReceiveProps route)
    fixtureId: fixtureId === undefined ? getUpdateId() : fixtureId,
  };
};

class RemoteLoader extends Component {
  /**
   * Remote loader for rendering React components in isolation.
   *
   * Renders components using fixtures and Proxy middleware. Controlled
   * programatically by a parent frame (via postMessage protocol).
   *
   * It both receives fixture changes from parent frame and sends fixture
   * updates bubbled up from proxy chain (due to state changes) to parent frame.
   */
  state = noFixtureState;

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);

    // Let parent know loader is ready to render, along with the initial
    // fixture list (which might update later due to HMR)
    const { fixtures } = this.props;
    parent.postMessage(
      {
        type: 'loaderReady',
        fixtures: extractFixtureNames(fixtures),
      },
      '*'
    );
  }

  componentWillReceiveProps({ fixtures }) {
    if (fixtures === this.props.fixtures) {
      return;
    }

    // Keep parent frame in sync when fixture files change (udpated via
    // webpack HMR)
    parent.postMessage(
      {
        type: 'fixtureListUpdate',
        fixtures: extractFixtureNames(fixtures),
      },
      '*'
    );

    const { component, fixture } = this.state;

    // Reset fixture state to reflect fixture file changes
    this.setState(
      getFixtureState({
        fixtures,
        component,
        fixture,
      }),
      () => {
        // Keep parent frame in sync with latest fixture body
        this.onFixtureUpdate(this.state.fixtureBody.serializable);
      }
    );
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  onMessage = ({ data }) => {
    const { type } = data;

    if (type === 'fixtureSelect') {
      this.onFixtureSelect(data);
    } else if (type === 'fixtureEdit') {
      this.onFixtureEdit(data);
    }
  };

  onFixtureSelect({ component, fixture }) {
    const { fixtures } = this.props;

    this.setState(
      getFixtureState({
        fixtures,
        component,
        fixture,
      }),
      () => {
        if (fixture) {
          const { serializable: fixtureBody } = this.state.fixtureBody;

          // Notify back parent with the serializble contents of the loaded fixture
          parent.postMessage(
            {
              type: 'fixtureLoad',
              fixtureBody,
            },
            '*'
          );
        }
      }
    );
  }

  onFixtureEdit({ fixtureBody }) {
    const { fixtures } = this.props;
    const { component, fixture } = this.state;

    this.setState(
      getFixtureState({
        fixtures,
        component,
        fixture,
        fixtureBody,
      })
    );
  }

  onFixtureUpdate = fixtureBody => {
    const { fixtures } = this.props;
    const {
      component,
      fixture,
      fixtureBody: { serializable },
      fixtureId,
    } = this.state;

    this.setState(
      getFixtureState({
        fixtures,
        component,
        fixture,
        // Fixture updates are partial
        fixtureBody: {
          ...serializable,
          ...fixtureBody,
        },
        // Preserve React instances when fixture change comes from state changes
        fixtureId,
      })
    );

    try {
      parent.postMessage(
        {
          type: 'fixtureUpdate',
          fixtureBody,
        },
        '*'
      );
    } catch (err) {
      console.warn('[Cosmos] Failed to send fixture update to parent', err);
    }
  };

  render() {
    const { proxies, components } = this.props;
    const { component, fixtureBody, fixtureId } = this.state;

    if (!component) {
      return null;
    }

    const firstProxy = createLinkedList([...proxies, PropsProxy]);
    const { unserializable, serializable } = fixtureBody;

    return (
      <firstProxy.value
        key={fixtureId}
        nextProxy={firstProxy.next()}
        component={components[component]}
        fixture={merge({}, unserializable, serializable)}
        onComponentRef={noope}
        onFixtureUpdate={this.onFixtureUpdate}
      />
    );
  }
}

RemoteLoader.propTypes = {
  components: object.isRequired,
  fixtures: object.isRequired,
  proxies: array,
};

RemoteLoader.defaultProps = {
  proxies: [],
};

export default RemoteLoader;
