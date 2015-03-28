var _ = require('lodash'),
    Cosmos = require('./cosmos.js');

_.extend(Cosmos.mixins, {
  ClassName: require('./mixins/class-name.js'),
  ComponentTree: require('./mixins/component-tree.js'),
  Router: require('./mixins/router.js')
});

_.extend(Cosmos.components, {
  ComponentPlayground:
      require('./component-playground/component-playground.jsx')
});

module.exports = Cosmos;
