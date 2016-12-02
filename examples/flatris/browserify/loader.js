import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Replace with 'react-cosmos' & 'react-cosmos-redux-proxy' in real life
import { startLoader } from '../../../packages/react-cosmos';
import reactCosmosReduxProxy from '../../../packages/react-cosmos-redux-proxy';

import { components, fixtures } from './prepare-modules';
import flatrisReducer from '../src/reducer';

module.exports = startLoader({
  proxies: [reactCosmosReduxProxy({
    createStore: (initialState) =>
      createStore(flatrisReducer, initialState, applyMiddleware(thunk)),
  })],
  components,
  fixtures,
});
