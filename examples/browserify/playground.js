// Not using ES6 to not have to apply Babel to the playground build (since it's
// already compiled)
const mountPlayground = require('react-cosmos-playground');

module.exports = mountPlayground({
  projectKey: 'browserify-example',
  platform: 'web',
  loaderUri: 'http://localhost:8990/'
});
