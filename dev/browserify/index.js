import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import flatrisReducer from '../../example/src/reducer';

// Replace with 'react-cosmos' in real life
import startReactCosmos from '../../packages/react-cosmos';
import reactCosmosReduxProxy from '../../packages/react-cosmos-redux-proxy';

const components = require('../../example/src/components/**/*{.js,.jsx}', { mode: 'hash' });
const fixtures = require('../../example/fixtures/**/*.js', { mode: 'hash' });

module.exports = startReactCosmos({
  proxies: [reactCosmosReduxProxy({
    createStore: (initialState) =>
      createStore(flatrisReducer, initialState, applyMiddleware(thunk)),
  })],
  components,
  fixtures,
});
