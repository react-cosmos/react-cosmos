import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import flatrisReducer from '../../example/src/reducer';

// Replace with 'react-cosmos' in real life
import startReactCosmos from '../../packages/react-cosmos';
import reactCosmosReduxProxy from '../../packages/react-cosmos-redux-proxy';

const requireComponent = require.context('COSMOS_COMPONENTS_PATH', true);
const requireFixture = require.context('COSMOS_FIXTURES_PATH', true);

const mapContext = (requireContext) =>
  requireContext.keys().reduce((prev, nextPath) => {
    // Sometimes files crash. E.g. Class components crash when loaded
    // with React <=0.12
    try {
      const cleanPath = nextPath.match(/^\.\/(.+?)(\.jsx?)?$/)[1];
      prev[cleanPath] = requireContext(nextPath);
    } catch (e) {
      console.log(e);
    }
    return prev;
  }, {});

const components = mapContext(requireComponent);
const fixtures = mapContext(requireFixture);

module.exports = startReactCosmos({
  proxies: [reactCosmosReduxProxy({
    createStore: (initialState) =>
      createStore(flatrisReducer, initialState, applyMiddleware(thunk)),
  })],
  components,
  fixtures,
});
