import React from 'react';
import { object } from 'prop-types';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

const defaults = {
  fixtureKey: 'reduxState',
  alwaysCreateStore: false,
  disableLocalState: true
};

export default function createReduxProxy(options) {
  const { fixtureKey, createStore, alwaysCreateStore, disableLocalState } = {
    ...defaults,
    ...options
  };

  class ReduxProxy extends React.Component {
    constructor(props) {
      super(props);
      this.onStoreChange = this.onStoreChange.bind(this);

      const fixtureReduxState = props.fixture[fixtureKey];
      if (alwaysCreateStore || fixtureReduxState) {
        this.store = createStore(fixtureReduxState);
      }
    }

    getChildContext() {
      return {
        store: this.store
      };
    }

    componentWillMount() {
      const { store, onStoreChange } = this;
      if (store) {
        this.storeUnsubscribe = store.subscribe(onStoreChange);
      }
    }

    componentWillUnmount() {
      if (this.storeUnsubscribe) {
        this.storeUnsubscribe();
      }
    }

    onStoreChange() {
      const { onFixtureUpdate } = this.props;
      const updatedState = this.store.getState();

      onFixtureUpdate({
        [fixtureKey]: updatedState
      });
    }

    render() {
      const { nextProxy, fixture, onComponentRef } = this.props;

      return React.createElement(nextProxy.value, {
        ...this.props,
        nextProxy: nextProxy.next(),
        fixture,
        onComponentRef,
        // Disable StateProxy when Redux state is available, otherwise the entire
        // Redux store would be duplicated from the connect() component's state
        disableLocalState: disableLocalState && Boolean(this.store)
      });
    }
  }

  ReduxProxy.propTypes = proxyPropTypes;

  ReduxProxy.childContextTypes = {
    store: object
  };

  return ReduxProxy;
}
