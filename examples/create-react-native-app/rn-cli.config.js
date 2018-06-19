const { resolve } = require('path');
const getConfig = require('metro-bundler-config-yarn-workspaces');

module.exports = getConfig(__dirname, {
  nodeModules: resolve(__dirname, '../../node_modules'),
  enableBabelRCLookup: false
});
