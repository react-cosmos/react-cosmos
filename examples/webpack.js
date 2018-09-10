exports.useRootBabelConfig = function(config) {
  // Use the global monorepo Babel config in example webpack builds
  const { rules } = config.module;
  const babelRule = rules.find(r => r.loader.match(/babel-loader/));
  babelRule.options = require('../babel.config.js');

  return config;
};
