/* global window */

// TODO: Move playground entry to react-cosmos-playground (which will eat
// everything that's currently in react-component-playground)
const { startPlayground } = require('react-cosmos');

// eslint-disable-next-line no-undef
const fixtures = COSMOS_FIXTURES;

startPlayground({
  fixtures,
  loaderUri: './loader/index.html',
});
