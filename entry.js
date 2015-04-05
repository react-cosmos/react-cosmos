var Cosmos = require('./cosmos.js');

Cosmos.mixins = {
  ComponentTree: require('./mixins/component-tree.js'),
  Router: require('./mixins/router.js')
};

module.exports = Cosmos;
