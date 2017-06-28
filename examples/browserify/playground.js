// Not using ES6 to not have to apply Babel to the playground build (since it's
// already compiled)
// Replace with 'react-cosmos-component-playground' in real life
const mountPlayground = require('../../packages/react-cosmos-component-playground');

module.exports = mountPlayground({
  loaderUri: 'http://localhost:8990/',
});
