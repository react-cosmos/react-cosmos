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
    nextProxy: React.PropTypes.shape({
      value: React.PropTypes.func,
      next: React.PropTypes.func,
    }).isRequired,
    component: React.PropTypes.func.isRequired,
    fixture: React.PropTypes.object.isRequired,
    onComponentRef: React.PropTypes.func.isRequired,
    onFixtureUpdate: React.PropTypes.func.isRequired,
  };

  ReduxProxy.childContextTypes = {
    store: React.PropTypes.object,
  };

  return ReduxProxy;
}
