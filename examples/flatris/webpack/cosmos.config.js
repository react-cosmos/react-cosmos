import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import createReduxProxy from '../../../packages/react-cosmos-redux-proxy';
import flatrisReducer from '../src/reducer';

module.exports = {
  componentPaths: [
    '../src/components',
  ],
  proxies: [createReduxProxy({
    createStore: initialState =>
      createStore(flatrisReducer, initialState, applyMiddleware(thunk)),
  })],
  hot: true,
  hmrPlugin: true,
};
