import PropTypes from 'prop-types';
import React from 'react';

const defaults = {
  fixtureKey: 'reduxState',
  alwaysCreateStore: false,
  disableLocalState: true,
};

export default function createReduxProxy(options) {
  const {
    fixtureKey,
    createStore,
    alwaysCreateStore,
    disableLocalState,
  } = { ...defaults, ...options };

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
        store: this.store,
      };
    }

    componentWillMount() {
      const {
        store,
        onStoreChange,
      } = this;
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
      const {
        onFixtureUpdate,
      } = this.props;
      const updatedState = this.store.getState();

      onFixtureUpdate({
        [fixtureKey]: updatedState,
      });
    }

    render() {
      const {
        nextProxy,
        fixture,
        onComponentRef,
      } = this.props;

      return React.createElement(nextProxy.value, { ...this.props,
        nextProxy: nextProxy.next(),
        fixture,
        onComponentRef,
        // Disable StateProxy when Redux state is available, otherwise the entire
        // Redux store would be duplicated from the connect() component's state
        disableLocalState: disableLocalState && Boolean(this.store),
      });
    }
  }

  ReduxProxy.propTypes = {
    nextProxy: PropTypes.shape({
      value: PropTypes.func,
      next: PropTypes.func,
    }).isRequired,
    component: PropTypes.func.isRequired,
    fixture: PropTypes.object.isRequired,
    onComponentRef: PropTypes.func.isRequired,
    onFixtureUpdate: PropTypes.func.isRequired,
  };

  ReduxProxy.childContextTypes = {
    store: PropTypes.object,
  };

  return ReduxProxy;
}
