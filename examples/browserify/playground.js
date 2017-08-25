// Not using ES6 to not have to apply Babel to the playground build (since it's
// already compiled)
const mountPlayground = require('react-cosmos-component-playground');

module.exports = mountPlayground({
  loaderUri: 'http://localhost:8990/'
});
