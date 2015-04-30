require('./global-reset.css');

var ReactQuerystringRouter = require('react-querystring-router'),
    ComponentPlayground = require('react-component-playground'),
    getComponentFixtureTree = require('./lib/get-component-fixture-tree.js'),
    getTitleForFixture = require('./lib/get-title-for-fixture.js');

module.exports = new ReactQuerystringRouter.Router({
  container: document.getElementById('component-playground'),
  defaultProps: {
    components: getComponentFixtureTree()
  },
  getComponentClass: function() {
    return ComponentPlayground;
  },
  onChange: function(params) {
    document.title = getTitleForFixture(params);
  }
});
