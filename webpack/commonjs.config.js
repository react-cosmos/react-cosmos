var _ = require('lodash'),
    baseConfig = require('./base.config.js');

module.exports = _.merge({}, baseConfig, {
  externals: {
    'lodash': 'lodash',
    'react/addons': 'react/addons'
  },
  output: {
    libraryTarget: 'commonjs2',
    filename: './build/cosmos.commonjs.js'
  }
});
