import React from 'react';
import { object } from 'prop-types';
import { proxyPropTypes } from 'react-cosmos-shared/lib/react';

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
      this.rebuildStore(props);
      this.state = { storeId: 0 };
    }

    getChildContext() {
      return {
        store: this.store
      };
    }

    componentWillReceiveProps(nextProps) {
      const oldReduxState = this.props.fixture[fixtureKey];
      const newReduxState = nextProps.fixture[fixtureKey];
      if (oldReduxState !== newReduxState) {
        this.reloadStore(nextProps);
      }
    }

    componentDidMount() {
      this.subscribeToStore();
    }

    componentWillUnmount() {
      this.unsubscribeFromStore();
    }

    rebuildStore(props) {
      const fixtureReduxState = props.fixture[fixtureKey];
      if (alwaysCreateStore || fixtureReduxState) {
        this.store = createStore(fixtureReduxState);
      }
    }

    reloadStore(props) {
      this.unsubscribeFromStore();
      this.rebuildStore(props);
      this.subscribeToStore();
      this.setState({ storeId: this.state.storeId + 1 });
    }

    subscribeToStore() {
      const { store, onStoreChange } = this;
      if (store) {
        this.storeUnsubscribe = store.subscribe(onStoreChange);
      }
    }

    unsubscribeFromStore() {
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
        key: this.state.storeId,
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
