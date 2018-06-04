// @flow

import React, { Component } from 'react';
import { object } from 'prop-types';

import type { ProxyProps } from 'react-cosmos-flow/proxy';
import type { Unsubscribe, ReduxStore, ReduxStoreCreator } from './redux-types';

type Options = {
  createStore: ReduxStoreCreator,
  fixtureKey?: string,
  alwaysCreateStore?: boolean,
  disableLocalState?: boolean
};

type State = {
  storeId: number
};

export function createReduxProxy({
  createStore,
  fixtureKey = 'reduxState',
  alwaysCreateStore = false,
  disableLocalState = true
}: Options) {
  class ReduxProxy extends Component<ProxyProps, State> {
    static childContextTypes = {
      store: object
    };

    store: ReduxStore;

    storeUnsubscribe: Unsubscribe;

    state = {
      storeId: 0
    };

    constructor(props: ProxyProps) {
      super(props);
      this.rebuildStore(props);
    }

    getChildContext() {
      return {
        store: this.store
      };
    }

    componentWillReceiveProps(nextProps: ProxyProps) {
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

    rebuildStore(props: ProxyProps) {
      const fixtureReduxState = props.fixture[fixtureKey];
      if (alwaysCreateStore || fixtureReduxState) {
        this.store = createStore(fixtureReduxState);
      }
    }

    reloadStore(props: ProxyProps) {
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

    onStoreChange = () => {
      const { onFixtureUpdate } = this.props;
      const updatedState = this.store.getState();

      onFixtureUpdate({
        [fixtureKey]: updatedState
      });
    };

    render() {
      const { nextProxy, ...rest } = this.props;
      const { value: NextProxy, next } = nextProxy;

      return (
        <NextProxy
          {...rest}
          key={this.state.storeId}
          nextProxy={next()}
          disableLocalState={
            // Disable StateProxy when Redux state is available, otherwise the entire
            // Redux store would be duplicated from the connect() component's state
            disableLocalState && Boolean(this.store)
          }
        />
      );
    }
  }

  return ReduxProxy;
}
