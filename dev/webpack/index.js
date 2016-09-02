// Replace with 'react-cosmos' in real life
var startReactCosmos = require('../../packages/react-cosmos');

var requireComponent = require.context('COSMOS_COMPONENTS_PATH', true);
var requireFixture = require.context('COSMOS_FIXTURES_PATH', true);

var mapContext = (requireContext) =>
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

var components = mapContext(requireComponent);
var fixtures = mapContext(requireFixture);

module.exports = startReactCosmos(components, fixtures);
