/* eslint-disable react/require-extension */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import flatrisReducer from '../src/reducer';
import { prepareComponents, prepareFixtures } from './prepare-modules';

// Replace with 'react-cosmos' & 'react-cosmos-redux-proxy' in real life
import startReactCosmos from '../../../packages/react-cosmos';
import reactCosmosReduxProxy from '../../../packages/react-cosmos-redux-proxy';

const componentModules = require('../src/components/**/*{.js,.jsx}', { mode: 'hash' });
const fixtureModules = require('../src/components/__fixtures__/**/*.js', { mode: 'hash' });

const components = prepareComponents(componentModules);
const fixtures = prepareFixtures(fixtureModules, components);

module.exports = startReactCosmos({
  proxies: [reactCosmosReduxProxy({
    createStore: (initialState) =>
      createStore(flatrisReducer, initialState, applyMiddleware(thunk)),
  })],
  components,
  fixtures,
});
