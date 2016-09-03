var ReactQuerystringRouter = require('react-querystring-router'),
    ComponentPlayground = require('react-component-playground'),
    getComponentFixtures = require('./get-component-fixtures.js');

var getTitleForFixture = function(params) {
  var title = 'React Cosmos';

  // Set document title to the name of the selected fixture
  if (params.component && params.fixture) {
    title = params.component + ':' + params.fixture + ' – ' + title;
  }

  return title;
};

module.exports = (components, fixtures) =>
  new ReactQuerystringRouter.Router({
    container: document.body.appendChild(document.createElement('div')),
    defaultProps: {
      components: getComponentFixtures(components, fixtures)
    },
    getComponentClass: function() {
      return ComponentPlayground;
    },
    onChange: function(params) {
      document.title = getTitleForFixture(params);
    }
  });
