import React, { Component } from 'react';
import { object, objectOf, func, arrayOf } from 'prop-types';
import merge from 'lodash.merge';
import splitUnserializableParts from 'react-cosmos-utils/lib/unserializable-parts';
import createLinkedList from 'react-cosmos-utils/lib/linked-list';
import importModule from 'react-cosmos-utils/lib/import-module';
import importComponent from 'react-cosmos-utils/lib/import-component';
import createModuleType from '../../utils/module-type';
import PropsProxy from '../PropsProxy';

const noope = () => {};

const createProxyLinkedList = userProxies =>
  createLinkedList([
    ...userProxies.map(proxy => importModule(proxy)),
    PropsProxy
  ]);

const noFixtureState = {
  component: null,
  fixture: null,
  fixtureBody: null,
  fixtureId: 0
};

let updateId = 0;

const getUpdateId = () => ++updateId;

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
  fixtureId
}) => {
  if (!fixture) {
    return noFixtureState;
  }

  const { unserializable, serializable } = splitUnserializableParts(
    importModule(fixtures[component][fixture])
  );

  return {
    component,
    fixture,
    fixtureBody: {
      unserializable,
      serializable: fixtureBody === undefined ? serializable : fixtureBody
    },
    // Used as React Element key to ensure loaded components are rebuilt on
    // every fixture change (instead of reusing instance and going down the
    // componentWillReceiveProps route)
    fixtureId: fixtureId === undefined ? getUpdateId() : fixtureId
  };
};

const postMessageToParent = data => parent.postMessage(data, '*');

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

  constructor(props) {
    super(props);

    this.firstProxy = createProxyLinkedList(props.proxies);
  }

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);

    // Let parent know loader is ready to render, along with the initial
    // fixture list (which might update later due to HMR)
    const { fixtures } = this.props;
    postMessageToParent({
      type: 'loaderReady',
      fixtures: extractFixtureNames(fixtures)
    });
  }

  componentWillReceiveProps({ proxies, fixtures }) {
    if (proxies !== this.props.proxies) {
      this.firstProxy = createProxyLinkedList(proxies);
    }

    if (fixtures === this.props.fixtures) {
      return;
    }

    // Keep parent frame in sync when fixture files change (udpated via
    // webpack HMR)
    postMessageToParent({
      type: 'fixtureListUpdate',
      fixtures: extractFixtureNames(fixtures)
    });

    const { component, fixture } = this.state;

    // Reset fixture state to reflect fixture file changes
    this.setState(
      getFixtureState({
        fixtures,
        component,
        fixture
      }),
      () => {
        if (component && fixture) {
          // Keep parent frame in sync with latest fixture body
          this.onFixtureUpdate(this.state.fixtureBody.serializable);
        }
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
    const state = getFixtureState({
      fixtures,
      component,
      fixture
    });

    if (fixture) {
      const { serializable: fixtureBody } = state.fixtureBody;

      // Notify back parent with the serializable contents of the loaded fixture
      postMessageToParent({
        type: 'fixtureLoad',
        fixtureBody
      });
    }

    this.setState(state);
  }

  onFixtureEdit({ fixtureBody }) {
    const { fixtures } = this.props;
    const { component, fixture } = this.state;

    this.setState(
      getFixtureState({
        fixtures,
        component,
        fixture,
        fixtureBody
      })
    );
  }

  onFixtureUpdate = fixtureBody => {
    const { fixtures } = this.props;
    const {
      component,
      fixture,
      fixtureBody: { serializable },
      fixtureId
    } = this.state;

    this.setState(
      getFixtureState({
        fixtures,
        component,
        fixture,
        // Fixture updates are partial
        fixtureBody: {
          ...serializable,
          ...fixtureBody
        },
        // Preserve React instances when fixture change comes from state changes
        fixtureId
      })
    );

    try {
      postMessageToParent({
        type: 'fixtureUpdate',
        fixtureBody
      });
    } catch (err) {
      console.warn('[Cosmos] Failed to send fixture update to parent', err);
    }
  };

  render() {
    const { components } = this.props;
    const { component, fixtureBody, fixtureId } = this.state;

    if (!component) {
      return null;
    }

    const { firstProxy } = this;
    const { unserializable, serializable } = fixtureBody;

    return (
      <firstProxy.value
        key={fixtureId}
        nextProxy={firstProxy.next()}
        component={importComponent(components[component], component)}
        fixture={merge({}, unserializable, serializable)}
        onComponentRef={noope}
        onFixtureUpdate={this.onFixtureUpdate}
      />
    );
  }
}

RemoteLoader.propTypes = {
  components: objectOf(createModuleType(func)).isRequired,
  fixtures: objectOf(objectOf(createModuleType(object))).isRequired,
  proxies: arrayOf(createModuleType(func))
};

RemoteLoader.defaultProps = {
  proxies: []
};

export default RemoteLoader;
