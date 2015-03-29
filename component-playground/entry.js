require('./global-reset.css');

var Cosmos = require('../build/cosmos.commonjs.js'),
    ComponentPlayground = require('./component-playground.jsx'),
    getTitleForFixture = require('./lib/get-title-for-fixture.js'),
    config = require('./config.js');

module.exports = Cosmos.start({
  container: document.getElementById('component-playground'),

  defaultProps: {
    component: 'ComponentPlayground',
    componentLookup: function(name) {
      if (name == 'ComponentPlayground') {
        return ComponentPlayground;
      }
      return config.componentLookup(name);
    },
    fixtures: config.fixtures
  },

  onChange: function(props) {
    document.title = getTitleForFixture(props);
  }
});
