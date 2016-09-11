// Replace with 'react-cosmos' in real life
const startReactCosmos = require('../../packages/react-cosmos');

const components = require('../components/**/*{.js,.jsx}', { mode: 'hash' });
const fixtures = require('../fixtures/**/*.js', { mode: 'hash' });

module.exports = startReactCosmos(components, fixtures);
