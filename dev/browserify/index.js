// Replace with 'react-cosmos' in real life
const startReactCosmos = require('../../packages/react-cosmos');

const components = require('../../example/src/components/**/*{.js,.jsx}', { mode: 'hash' });
const fixtures = require('../../example/fixtures/**/*.js', { mode: 'hash' });

module.exports = startReactCosmos(components, fixtures);
