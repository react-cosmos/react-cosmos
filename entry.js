var Cosmos = require('./cosmos.js');

Cosmos.mixins = {
  ClassName: require('./mixins/class-name.js'),
  ComponentTree: require('./mixins/component-tree.js'),
  Router: require('./mixins/router.js')
};

module.exports = Cosmos;
