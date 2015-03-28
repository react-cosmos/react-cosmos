var Cosmos = require('../build/cosmos.commonjs.js'),
    // TODO: Receive as arg through bin/component-playground.js
    fixtures = require('./examples/fixtures.js');

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
    fixtures: fixtures
  },

  onChange: function(props) {
    document.title = getTitleForFixture(props);
  }
});
