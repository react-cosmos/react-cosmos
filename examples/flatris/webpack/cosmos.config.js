import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reactCosmosReduxProxy from '../../../packages/react-cosmos-redux-proxy';
import flatrisReducer from '../src/reducer';

module.exports = {
  componentPaths: [
    '../src/components',
  ],
  proxies: [reactCosmosReduxProxy({
    createStore: (initialState) =>
      createStore(flatrisReducer, initialState, applyMiddleware(thunk)),
  })],
  hot: true,
};
