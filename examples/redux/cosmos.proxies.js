// @flow

import createReduxProxy from 'react-cosmos-redux-proxy';
import configureStore from './configureStore';

const ReduxProxy = createReduxProxy({
  createStore: initialState => configureStore(initialState)
});

export default [
  ReduxProxy
  // ...other proxies
];
