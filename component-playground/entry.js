require('./global-reset.css');

var ReactMinimalRouter = require('react-minimal-router'),
    ComponentPlayground = require('react-component-playground'),
    getFixtureTree = require('./lib/get-fixture-tree.js'),
    getTitleForFixture = require('./lib/get-title-for-fixture.js');

module.exports = new ReactMinimalRouter.Router({
  container: document.getElementById('component-playground'),
  defaultProps: {
    fixtures: getFixtureTree()
  },
  getComponentClass: function() {
    return ComponentPlayground;
  },
  onChange: function(params) {
    document.title = getTitleForFixture(params);
  }
});
