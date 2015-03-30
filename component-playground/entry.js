require('./global-reset.css');

var Cosmos = require('../build/cosmos.commonjs.js'),
    ComponentPlayground = require('./component-playground.jsx'),
    getFixtureTree = require('./lib/get-fixture-tree.js'),
    getTitleForFixture = require('./lib/get-title-for-fixture.js');

module.exports = Cosmos.start({
  container: document.getElementById('component-playground'),

  defaultProps: {
    component: 'ComponentPlayground',
    componentLookup: function(componentName) {
      if (componentName == 'ComponentPlayground') {
        return ComponentPlayground;
      }
      return require('components/' + componentName + '.jsx');
    },
    fixtures: getFixtureTree()
  },

  onChange: function(props) {
    document.title = getTitleForFixture(props);
  }
});
