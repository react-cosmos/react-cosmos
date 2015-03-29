require('./global-reset.css');

var Cosmos = require('../build/cosmos.commonjs.js'),
    ComponentPlayground = require('./component-playground.jsx'),
    config = require('./config.js');

var getTitleForFixture = function(props) {
  var title = 'React Component Playground';

  // Set document title to the name of the selected fixture
  if (props.selectedComponent && props.selectedFixture) {
    title = props.selectedComponent + ':' +
            props.selectedFixture + ' – ' +
            title;
  }

  return title;
};

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
