module.exports = function(params) {
  var title = 'React Component Playground';

  // Set document title to the name of the selected fixture
  if (params.component && params.fixture) {
    title = params.component + ':' + params.fixture + ' – ' + title;
  }

  return title;
};
