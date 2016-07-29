var ReactQuerystringRouter = require('react-querystring-router'),
    ComponentPlayground = require('react-component-playground'),
    getComponentFixtureTree = require('./get-component-fixture-tree.js');

var getTitleForFixture = function(params) {
  var title = 'React Component Playground';

  // Set document title to the name of the selected fixture
  if (params.component && params.fixture) {
    title = params.component + ':' + params.fixture + ' – ' + title;
  }

  return title;
};

module.exports = new ReactQuerystringRouter.Router({
  container: document.getElementById('root'),
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
